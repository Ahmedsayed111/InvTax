using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.IItems
{
 public  class IItemsService: ItemsService
    {
        private readonly IUnitOfWork unitOfWork;

        public IItemsService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public Items GetById(int id)
        {
            return unitOfWork.Repository<Items>().GetById(id);
        }


        public Items Insert(Items entity)
        {
            var Item = unitOfWork.Repository<Items>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public Items Update(Items entity)
        {

            var Item = unitOfWork.Repository<Items>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<Items> entityList)
        {
            unitOfWork.Repository<Items>().Update(entityList);
            unitOfWork.Save();

        }
        public void Delete(int id)
        {
            unitOfWork.Repository<Items>().Delete(id);
            unitOfWork.Save();
        }
         
    }
}
