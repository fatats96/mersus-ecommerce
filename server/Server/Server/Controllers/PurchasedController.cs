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
    public class PurchasedController : BaseController
    {
        private readonly PurchasedRepository _mainRepository = new PurchasedRepository();

        [HttpPost("purchasedItems")]
        public ResponseWrapper PurchasedItems([FromBody]Basket request)
        {
            _mainRepository.Session = Session;

            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _mainRepository.GetPurchasedProducts(request);
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
