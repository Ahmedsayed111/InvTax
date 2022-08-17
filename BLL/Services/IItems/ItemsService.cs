using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.IItems
{
    public interface ItemsService
    {
        Items GetById(int id);
        Items Insert(Items entity);
        Items Update(Items entity);
        void Delete(int id);
        void UpdateList(List<Items> Lstservice);
         
    }
}
