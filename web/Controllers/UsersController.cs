using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using CRMC.Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using web.Models;

namespace web.Controllers
{
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        private ApplicationUserManager _userManager;
        private ApplicationRoleManager _roleManager;

        public UserController()
        {
        }

        public UserController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        public ApplicationUserManager UserManager
        {
            get { return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set { _userManager = value; }
        }

        protected ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationRoleManager>();
            }
            private set { _roleManager = value; }
        }

        private IAuthenticationManager AuthenticationManager => HttpContext.Current.GetOwinContext().Authentication;

        [HttpGet]
        public IHttpActionResult GetCurrentUser()
        {
            var userId = User.Identity.GetUserId();
            var applicationUser = Mapper.Map<UserViewModel>(UserManager.Users.FirstOrDefault(x => x.Id == userId));

            if (applicationUser == null) return NotFound();

            return Ok(applicationUser);
        }

        [Route("{username?}")]
        public object Get([FromUri]string username = null)
        {

            var list =
                UserManager.Users.Where(x => (username == null) || x.UserName.Contains(username)).ToList();

            var users = Mapper.Map<List<ApplicationUser>, List<UserViewModel>>(list);

            //TODO: Remove this in mapping??
            foreach (var viewModel in users)
            {
                viewModel.Roles = UserManager.GetRolesAsync(viewModel.Id).Result.ToArray();
            }

            return Ok(users);
        }

        [HttpPost, Route("Update")]
        public async Task<object> Post([FromBody]UserViewModel vm)
        {
            var user = UserManager.FindByName(vm.UserName);

            if (user != null)
            {
                user.UserName = vm.UserName;
                user.Email = vm.Email;
                //return BadRequest("Username already exists");
                await UserManager.UpdateAsync(user);
                return Ok(user);
            }

            user = new ApplicationUser()
            {
                UserName = vm.UserName,
                Email = vm.Email,
            };

            IdentityResult addUserResult = await UserManager.CreateAsync(user, vm.Password);

            if (!addUserResult.Succeeded)
            {
                return await GetErrorResult(addUserResult);
            }

            var addResult = await UserManager.AddToRolesAsync(user.Id, vm.Roles);
            //TODO: Need automapping
            vm.Id = user.Id;
            return Ok(vm);
        }

        //public async Task<object> Put([FromBody]UserViewModel vm)
        //{
        //    //TODO: Automapper model to viewmodel
        //    var user = await UserManager.FindByIdAsync(vm.Id);

        //    var currentRoles = await UserManager.GetRolesAsync(vm.Id);
        //    var rolesNotExists = vm.Roles.Except(RoleManager.Roles.Select(x => x.Name)).ToArray();

        //    if (rolesNotExists.Any())
        //    {
        //        ModelState.AddModelError("", $"Roles '{string.Join(",", rolesNotExists)}' does not exixts in the system");
        //        return BadRequest(ModelState);
        //    }
        //    var removeResult = await UserManager.RemoveFromRolesAsync(vm.Id, currentRoles.ToArray());

        //    if (!removeResult.Succeeded)
        //    {
        //        ModelState.AddModelError("", "Failed to remove user roles");
        //        return BadRequest(ModelState);
        //    }
        //    var addResult = await UserManager.AddToRolesAsync(vm.Id, vm.Roles);

        //    if (!addResult.Succeeded)
        //    {
        //        ModelState.AddModelError("", "Failed to add user roles");
        //        return BadRequest(ModelState);
        //    }

        //    user.FullName = vm.FullName;
        //    user.Email = vm.Email;
        //    user.UserPhoto = vm.UserPhoto;
        //    user.UserPhotoType = vm.UserPhotoType;
        //    await UserManager.UpdateAsync(user);

        //    return Ok(vm);
        //}

        public async Task<IHttpActionResult> Delete(string id)
        {
            var user = await UserManager.FindByIdAsync(id);
            if (user != null)
            {
                await UserManager.DeleteAsync(user);
            }

            return Ok("User deleted");
        }

        //[HttpPost, Route("UploadAvatar/{id}")]
        //public async Task<IHttpActionResult> UploadAvatar(string id)
        //{
        //    var request = HttpContext.Current.Request;

        //    if (request.Files.Count == 0)
        //    {
        //        return BadRequest();
        //    }

        //    var postedFile = request.Files[0];

        //    var filename = postedFile.FileName.Substring(postedFile.FileName.LastIndexOf("\\", StringComparison.Ordinal) + 1);

        //    try
        //    {
        //        var filePath = HttpContext.Current.Server.MapPath(@"~\app_data\" + filename);
        //        postedFile.SaveAs(filePath);
        //        var file = new FileInfo(filePath);
        //        var destPath = HttpContext.Current.Server.MapPath(@"~\images\users\" + id + file.Extension);
        //        if (File.Exists(destPath)) File.Delete(destPath);
        //        file.MoveTo(destPath);
        //        File.Delete(filePath);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //    return Ok("Successfully saved avatar");
        //}

        [HttpGet]
        [Route("roles")]
        public IHttpActionResult Roles()
        {
            var roles = RoleManager.Roles.ToArray();
            return Ok(roles);
        }

        protected async Task<IHttpActionResult> GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return BadRequest();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }
                return BadRequest();
            }

            return null;
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }
    }
}
