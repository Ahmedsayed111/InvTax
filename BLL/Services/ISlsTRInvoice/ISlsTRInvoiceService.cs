using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ISlsTRInvoice
{
 public  class ISlsTRInvoiceService: IISlsTRInvoiceService
    {
        private readonly IUnitOfWork unitOfWork;

        public ISlsTRInvoiceService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public Sls_Ivoice GetById(int id)
        {
            return unitOfWork.Repository<Sls_Ivoice>().GetById(id);
        }


        public Sls_Ivoice Insert(Sls_Ivoice entity)
        {
            var Item = unitOfWork.Repository<Sls_Ivoice>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public Sls_Ivoice Update(Sls_Ivoice entity)
        {

            var Item = unitOfWork.Repository<Sls_Ivoice>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<Sls_InvoiceDetail> entityList)
        {
            unitOfWork.Repository<Sls_InvoiceDetail>().Update(entityList);
            unitOfWork.Save();

        }


        //#region ItemDefService Services

        //public IQ_GetItemStoreInfo GetById(int id)
        //{
        //    return unitOfWork.Repository<IQ_GetItemStoreInfo>().GetById(id);
        //}

        //public List<IQ_GetItemStoreInfo> GetAll()
        //{
        //    return unitOfWork.Repository<IQ_GetItemStoreInfo>().GetAll();
        //}

        //public List<IQ_GetItemStoreInfo> GetAll(Expression<Func<IQ_GetItemStoreInfo, bool>> predicate)
        //{
        //    return unitOfWork.Repository<IQ_GetItemStoreInfo>().Get(predicate);
        //}


        //public I_Item Update(I_Item entity)
        //{

        //    var Item = unitOfWork.Repository<I_Item>().Update(entity);
        //    unitOfWork.Save();
        //    return Item;
        //}

        //public void Delete(int id)
        //{
        //    unitOfWork.Repository<I_Item>().Delete(id);
        //    unitOfWork.Save();
        //}

        ////public void UpdateList(List<I_Item> Lstservice)
        ////// public void UpdateList(string s)
        ////{

        ////    var insertedRecord = Lstservice.Where(x => x.StatusFlag == 'i');
        ////    var updatedRecord = Lstservice.Where(x => x.StatusFlag == 'u');
        ////    var deletedRecord = Lstservice.Where(x => x.StatusFlag == 'd');

        ////    if (updatedRecord.Count() > 0)
        ////        unitOfWork.Repository<G_Nationality>().Update(updatedRecord);

        ////    if (insertedRecord.Count() > 0)
        ////        unitOfWork.Repository<G_Nationality>().Insert(insertedRecord);


        ////    if (deletedRecord.Count() > 0)
        ////    {
        ////        foreach (var entity in deletedRecord)
        ////            unitOfWork.Repository<G_Nationality>().Delete(entity.NationalityID);
        ////    }

        ////    unitOfWork.Save();

        ////}
        //#endregion
    }
}
