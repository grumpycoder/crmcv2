using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;
using System.Web.Http;
using CRMC.DataAccess;
using CRMC.Domain;
using web.Helpers;
using web.Models;

namespace web.Controllers
{
    public class CensorController : ApiController
    {
        private readonly DataContext _context = DataContext.Create();
        private const int PAGE_SIZE = 20;

        public object Get([FromUri]CensorSearchModel pager = null)
        {
            if (pager == null) pager = new CensorSearchModel();

            var query = _context.Censors;
            var totalCount = query.Count();

            var pred = PredicateBuilder.True<Censor>();
            if (!string.IsNullOrWhiteSpace(pager.Word)) pred = pred.And(p => p.Word.Contains(pager.Word));

            var filteredQuery = query.Where(pred);
            var pagerCount = filteredQuery.Count();

            var results = filteredQuery
                .Order(pager.OrderBy, pager.OrderDirection == "desc" ? SortDirection.Descending : SortDirection.Ascending)
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
                var censor = context.Censors.Find(id);
                if (censor == null) return NotFound();

                return Ok(censor);
            }
        }

        public object Post(Censor model)
        {
            using (var context = DataContext.Create())
            {
                var censor = context.Censors.Find(model.Id);
                if (censor != null)
                {
                    censor.Word = model.Word;
                }
                else
                {
                    censor = new Censor()
                    {
                        Word = model.Word
                    };

                }
                context.Censors.AddOrUpdate(censor);
                context.SaveChanges();

                return Ok(censor);
            }
        }

        [HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            using (var context = DataContext.Create())
            {
                var censor = context.Censors.Find(id);
                if (censor == null) return NotFound();

                context.Censors.Remove(censor);
                context.SaveChanges();
                return Ok("Deleted");
            }
        }

    }
}
