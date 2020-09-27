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
    public class ProductController : BaseController
    {
        private readonly ProductRepository _productRepository = new ProductRepository();

        [HttpPost("list")]
        public ResponseWrapper ListAll([FromBody] RequestWithPagination<Product> request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _productRepository.ListAll(request.Content);
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
        public ResponseWrapper GetById([FromBody] Product request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _productRepository.GetById(request);
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
        public ResponseWrapper Save([FromBody] Product request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _productRepository.Save(request);
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
        public ResponseWrapper Delete([FromBody] Product request)
        {
            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _productRepository.Delete(request);
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