using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Common;
using ServerDataLayer.Repositories;
using ServerTypeLayer;
using ServerTypeLayer.Models;

namespace Server.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class CategoryController : BaseController
    {
        private readonly CategoryRepository _categoryRepository = new CategoryRepository();

        [HttpPost("list")]
        public ResponseWrapper ListAll([FromBody] RequestWithPagination<Category> request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _categoryRepository.ListAll(request.Content);
                res.Message = Messages.LISTING_SUCCESSFUL;
                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = Messages.PROCESS_FAILED;
            }

            return res;
        }

        [HttpPost("getById")]
        public ResponseWrapper GetById([FromBody]Category request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _categoryRepository.GetById(request);
                res.Message = Messages.PROCESS_SUCCESSFUL;
                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = Messages.PROCESS_FAILED;
            }

            return res;
        }

        [HttpPost("save")]
        public ResponseWrapper Save([FromBody]Category request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _categoryRepository.Save(request);
                res.Message = Messages.PROCESS_SUCCESSFUL;
                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = Messages.PROCESS_FAILED;
            }

            return res;
        }

        [HttpPost("delete")]
        public ResponseWrapper Delete([FromBody]Category request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _categoryRepository.Delete(request);
                res.Message = Messages.PROCESS_SUCCESSFUL;
                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = Messages.PROCESS_FAILED;
            }

            return res;
        }
    }
}