using System;
using System.Collections.Generic;

namespace ServerDataLayer.Common
{
    public interface IBaseRepository<T>
    {
        List<T> ListAll(T parameters);
        T GetById(T parameters);
        T Save(T parameters);
        Boolean Delete(T parameters);
    }
}
