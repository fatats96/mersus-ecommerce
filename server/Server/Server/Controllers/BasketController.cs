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
    public class BasketController : BaseController
    {
        private readonly BasketRepository _mainRepository = new BasketRepository();

        [HttpPost("getBasket")]
        public ResponseWrapper GetBasket([FromBody]Basket request)
        {
            _mainRepository.Session = Session;

            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _mainRepository.GetBasket(request);
                res.Message = Messages.PROCESS_SUCCESSFUL;
                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = Messages.PROCESS_FAILED;
            }

            return res;
        }

        [HttpPost("addItem")]
        public ResponseWrapper AddItem([FromBody]Basket request)
        {
            _mainRepository.Session = Session;

            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _mainRepository.AddItemToBasket(request);
                res.Message = Messages.PROCESS_SUCCESSFUL;
                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = Messages.PROCESS_FAILED;
            }

            return res;
        }

        [HttpPost("confirmBasket")]
        public ResponseWrapper ConfirmBasket([FromBody] Basket request)
        {
            _mainRepository.Session = Session;

            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _mainRepository.ConfirmBasket(request);
                res.Message = Messages.PROCESS_SUCCESSFUL;
                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = Messages.PROCESS_FAILED;
            }

            return res;
        }

        [HttpPost("removeItem")]
        public ResponseWrapper RemoveItemFromBasket([FromBody] Basket request)
        {
            _mainRepository.Session = Session;

            ResponseWrapper res = new ResponseWrapper();

            try
            {
                res.Data = _mainRepository.RemoveItemFromBasket(request);
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
