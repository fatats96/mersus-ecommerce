using ServerDataLayer.Entity;

namespace ServerDataLayer
{
    public class ContextHelper
    {
        public static ECommerceContext GetContext() {
            return new ECommerceContext();
        }
    }
}
