using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Customer
{
    public interface ICustomerService
    {
        receiver GetById(int id);
        receiver Insert(receiver entity);
        receiver Update(receiver entity);
        void Delete(int id);
        void UpdateList(List<receiver> Lstservice);
         
    }
}
