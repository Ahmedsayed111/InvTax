using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.SlsInvoiceItems
{
    public interface ISlsInvoiceItemsService
    {
        List<Sls_InvoiceDetail> GetAll(Expression<Func<Sls_InvoiceDetail, bool>> predicate);
        void InsertLst(List<Sls_InvoiceDetail> obj);
        Sls_InvoiceDetail Insert(Sls_InvoiceDetail entity);
        Sls_InvoiceDetail Update(Sls_InvoiceDetail entity);
        void Delete(int id);
    }
}
