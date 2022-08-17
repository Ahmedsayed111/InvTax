using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Customer
{
 public  class CustomerService: ICustomerService
    {
        private readonly IUnitOfWork unitOfWork;

        public CustomerService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public receiver GetById(int id)
        {
            return unitOfWork.Repository<receiver>().GetById(id);
        }


        public receiver Insert(receiver entity)
        {
            var Item = unitOfWork.Repository<receiver>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public receiver Update(receiver entity)
        {

            var Item = unitOfWork.Repository<receiver>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<receiver> entityList)
        {
            unitOfWork.Repository<receiver>().Update(entityList);
            unitOfWork.Save();

        }
        public void Delete(int id)
        {
            unitOfWork.Repository<receiver>().Delete(id);
            unitOfWork.Save();
        }
         
    }
}
