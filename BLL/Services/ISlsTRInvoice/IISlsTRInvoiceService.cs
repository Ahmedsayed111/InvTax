using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ISlsTRInvoice
{
    public interface IISlsTRInvoiceService
    {
        Sls_Ivoice Insert(Sls_Ivoice entity);
        Sls_Ivoice Update(Sls_Ivoice entity);
        void UpdateList(List<Sls_InvoiceDetail> Lstservice);
        Sls_Ivoice GetById(int id);
        //List<IQ_GetItemStoreInfo> GetAll();
        //List<IQ_GetItemStoreInfo> GetAll(Expression<Func<IQ_GetItemStoreInfo, bool>> predicate);
        //I_Item Insert(I_Item entity);

        //void Delete(int id);
        //// void UpdateList(List<I_Item> Lstservice);
    }
}
