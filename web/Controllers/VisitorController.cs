// VisitorController.cs

using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Helpers;
using System.Web.Http;
using CRMC.DataAccess;
using CRMC.Domain;
using web.Helpers;
using web.Models;

namespace web.Controllers
{
    [RoutePrefix("api/visitor")]
    public class VisitorController : ApiController
    {
        private readonly DataContext _context = DataContext.Create();
        private const int PAGE_SIZE = 20;

        public object Get([FromUri] VisitorSearchModel pager = null)
        {
            if (pager == null) pager = new VisitorSearchModel();
            var query = _context.People;
            var totalCount = query.Count();

            var pred = PredicateBuilder.True<Person>();
            if (!string.IsNullOrWhiteSpace(pager.Firstname))
                pred = pred.And(p => p.Firstname.Contains(pager.Firstname));
            if (!string.IsNullOrWhiteSpace(pager.Lastname))
                pred = pred.And(p => p.Lastname.Contains(pager.Lastname));
            if (!string.IsNullOrWhiteSpace(pager.EmailAddress))
                pred = pred.And(p => p.EmailAddress.Contains(pager.EmailAddress));
            if (!string.IsNullOrWhiteSpace(pager.Zipcode))
                pred = pred.And(p => p.Zipcode.Contains(pager.Zipcode));

            if (pager.FuzzyMatchRange != null && pager.FuzzyMatchRange.Length == 1)
            {
                var min = pager.FuzzyMatchRange[0].ToDecimal();
                pred = pred.And(p => p.FuzzyMatchValue >= min);
            }
            if (pager.FuzzyMatchRange != null && pager.FuzzyMatchRange.Length == 2)
            {
                var min = pager.FuzzyMatchRange[0].ToDecimal();
                var max = pager.FuzzyMatchRange[1].ToDecimal();
                pred = pred.And(p => p.FuzzyMatchValue >= min && p.FuzzyMatchValue <= max);
            }
            var greaterThanDate = DateTime.Now.AddDays(pager.DaysOld * -1);
            if (greaterThanDate.Date != DateTime.Today.Date) pred = pred.And(p => p.DateCreated >= greaterThanDate);

            var filteredQuery = query.Where(pred);
            var pagerCount = filteredQuery.Count();

            var results = filteredQuery
                //.OrderByDescending(e => e.DateCreated)
                .Order(pager.OrderBy, pager.OrderDirection == "desc" ? SortDirection.Descending : SortDirection.Ascending)
                .ThenByDescending(m => m.DateCreated)
                .Skip(pager.PageSize * (pager.Page - 1) ?? 0)
                .Take(pager.PageSize ?? PAGE_SIZE)
                .ToList();

            var totalPages = Math.Ceiling((double)pagerCount / pager.PageSize ?? PAGE_SIZE);

            pager.TotalCount = totalCount;
            pager.FilteredCount = pagerCount;
            pager.TotalPages = totalPages;
            pager.Results = results;

            return Ok(pager);

        }

        public object Get(int id)
        {
            using (var context = DataContext.Create())
            {
                var visitor = context.People.Find(id);
                if (visitor == null) return NotFound();

                return Ok(visitor);
            }
        }

        public object Post(CreateEditVisitorModel model)
        {
            //TODO: SET DateCreated on saving context
            using (var context = DataContext.Create())
            {
                var visitor = context.People.Find(model.Id);
                if (visitor != null)
                {
                    visitor.Firstname = model.Firstname;
                    visitor.Lastname = model.Lastname;
                    visitor.EmailAddress = model.EmailAddress;
                    visitor.Zipcode = model.Zipcode;
                    visitor.IsDonor = model.IsDonor;
                    visitor.IsPriority = model.IsPriority;
                    visitor.FuzzyMatchValue = model.FuzzyMatchValue;

                }
                else
                {
                    visitor = new Person()
                    {
                        Firstname = model.Firstname,
                        Lastname = model.Lastname,
                        EmailAddress = model.EmailAddress,
                        Zipcode = model.Zipcode,
                        IsDonor = model.IsDonor,
                        IsPriority = model.IsPriority,
                        FuzzyMatchValue = model.FuzzyMatchValue,
                        SortOrder = Guid.NewGuid()
                    };

                }
                context.People.AddOrUpdate(visitor);
                context.SaveChanges();

                return Ok(visitor);
            }
        }

        [HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            using (var context = DataContext.Create())
            {
                var visitor = context.People.Find(id);
                if (visitor == null) return NotFound();

                context.People.Remove(visitor);
                context.SaveChanges();
                return Ok("Deleted");
            }
        }

        [HttpGet, Route("random")]
        public async Task<object> Random(int? take = 25, int? skip = 0, bool? priority = false)
        {
            var pred = PredicateBuilder.True<Person>();
            var list = await _context.People
                .OrderBy(e => e.SortOrder)
                .Skip(skip ?? 0)
                .Take(take ?? 25)
                .Select(e => new { e.Firstname, e.Lastname })
                .Distinct()
                .ToListAsync();
            return Ok(list);
        }
    }
}