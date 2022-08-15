using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.SlsInvoiceItems
{
   public class SlsInvoiceItemsService: ISlsInvoiceItemsService
    {
        private readonly IUnitOfWork unitOfWork;

        public SlsInvoiceItemsService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public List<Sls_InvoiceDetail> GetAll(Expression<Func<Sls_InvoiceDetail, bool>> predicate)
        {
            return unitOfWork.Repository<Sls_InvoiceDetail>().Get(predicate);
        }

        public void InsertLst(List<Sls_InvoiceDetail> obj)
        {
            unitOfWork.Repository<Sls_InvoiceDetail>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public Sls_InvoiceDetail Insert(Sls_InvoiceDetail entity)
        {
            var AccDefAccount = unitOfWork.Repository<Sls_InvoiceDetail>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public Sls_InvoiceDetail Update(Sls_InvoiceDetail entity)
        {

            var AccDefAccount = unitOfWork.Repository<Sls_InvoiceDetail>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<Sls_InvoiceDetail>().Delete(id);
            unitOfWork.Save();
        }
    }
}
