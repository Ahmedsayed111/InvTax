using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Unity;
using System.Web.Http.Dependencies;
using Inv.DAL.Repository;  
using Inv.BLL.Services.USER_BRANCH;
using Inv.BLL.Services.CompStatus;
using Inv.BLL.Services.G_Control;
using Inv.BLL.Services.GRole;
using Inv.BLL.Services.GRoleUsers;
using Inv.BLL.Services.GUSERS;
using Inv.BLL.Services.SlsTrSales;
using Inv.BLL.Services.IControl; 
using Inv.BLL.Services.SlsInvoiceItems;
using Inv.BLL.Services.ISlsTRInvoice;
namespace Inv.API.Infrastructure
{
    public static class IocConfigurator
    {

        public static void RegisterServices(IUnityContainer container)
        {
            container.RegisterType<IUnitOfWork, UnitOfWork>();

      
            container.RegisterType<IG_USER_BRANCHService, G_USER_BRANCHService>();

            container.RegisterType<II_VW_GetCompStatusService, I_VW_GetCompStatusService>(); 


            container.RegisterType<IG_ControlService, G_ControlService>(); 

            container.RegisterType<IGRoleService, GRoleService>();  

            container.RegisterType<IGRoleUsersService, GRoleUsersService>(); 

            container.RegisterType<IG_USERSService, G_USERSService>(); 
            
            container.RegisterType<II_ControlService, I_ControlService>();

            container.RegisterType<ISlsTrSalesServices, SlsTrSalesServices>();
            container.RegisterType<ISlsInvoiceItemsService, SlsInvoiceItemsService>();
            container.RegisterType<IISlsTRInvoiceService, ISlsTRInvoiceService>();
        }
    }
}