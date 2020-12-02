import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/system/login.vue'
import Home from '../components/home.vue'
import Welcom from '../components/welcome.vue'
import User from '../components/system/user.vue'
import Quit from '../components/system/quit.vue'
import Supplier from '../components/procurement/supplier.vue'
import AddPurchaseOrder from '../components/procurement/addPurchaseOrder.vue'
import PurchaseOrderClosure from '../components/procurement/purchaseOrderClosure.vue'
import SearchPurchaseOrder from '../components/procurement/searchPurchaseOrder.vue'
import WarehouseRegistration from '../components/warehousing/warehouseRegistration.vue'
import OutboundRegistration from '../components/warehousing/outboundRegistration.vue'
import StockTaking from '../components/warehousing/stockTaking.vue'
import SearchInventory from '../components/warehousing/searchInventory.vue'
import CollectionRegistration from '../components/financial/collectionRegistration.vue'
import PaymentRegistration from '../components/financial/paymentRegistration.vue'
import PaymentSearch from '../components/financial/paymentSearch.vue'
import ProductCategories from '../components/sales/productCategories.vue'
import ProductManagement from '../components/sales/productManagement.vue'
import Customer from '../components/sales/customer.vue'
import AddSalesList from '../components/sales/addSalesList.vue'
import SalesListClose from '../components/sales/salesListClose.vue'
import SearchSalesList from '../components/sales/searchSalesList.vue'
import PurchasingReport from '../components/businessReport/purchasingReport.vue'
import PaymentRegistrationReport from '../components/businessReport/paymentRegistrationReport.vue'
import WarehouseReport from '../components/businessReport/warehouseReport.vue'
import OutboundReport from '../components/businessReport/outboundReport.vue'
import InventoryReport from '../components/businessReport/inventoryReport.vue'
import SalesReport from '../components/businessReport/salesReport.vue'
import CustomerRegist from '../components/onlineSales/customerRegist.vue'
import ShowProducts from '../components/onlineSales/showProducts.vue'
import OrderOnline from '../components/onlineSales/orderOnline.vue'
import Neworder from '../components/procurement/newOrder.vue'
import Newsaleorder from '../components/sales/newSaleOrder.vue'

Vue.use(Router)

const router = new Router({
  routes: [ 
    {path: '/',name: 'Login',component: Login,},
    {path: '/home',name: 'Home',redirect:'/welcom', component: Home,children:[
      {path:'/welcom',component:Welcom},
      {path:'/user',component:User},
      {path:'/quit',component:Quit},
      {path:'/supplier',component:Supplier},
      {path:'/addPurchaseOrder',component:AddPurchaseOrder},
      {path:'/purchaseOrderClosure',component:PurchaseOrderClosure},
      {path:'/searchPurchaseOrder',component:SearchPurchaseOrder},
      {path:'/warehouseRegistration',component:WarehouseRegistration},
      {path:'/outboundRegistration',component:OutboundRegistration},
      {path:'/stockTaking',component:StockTaking},
      {path:'/searchInventory',component:SearchInventory},
      {path:'/collectionRegistration',component:CollectionRegistration},
      {path:'/paymentRegistration',component:PaymentRegistration},
      {path:'/paymentSearch',component:PaymentSearch},
      {path:'/productCategories',component:ProductCategories},
      {path:'/productManagement',component:ProductManagement},
      {path:'/customer',component:Customer},
      {path:'/addSalesList',component:AddSalesList},
      {path:'/salesListClose',component:SalesListClose},
      {path:'/searchSalesList',component:SearchSalesList},
      {path:'/purchasingReport',component:PurchasingReport},
      {path:'/paymentRegistrationReport',component:PaymentRegistrationReport},
      {path:'/warehouseReport',component:WarehouseReport},
      {path:'/outboundReport',component:OutboundReport},
      {path:'/inventoryReport',component:InventoryReport},
      {path:'/salesReport',component:SalesReport},
      {path:'/customerRegist',component:CustomerRegist},
      {path:'/showProducts',component:ShowProducts},
      {path:'/orderOnline',component:OrderOnline},
      {path:'/newOrder',component:Neworder},
      {path:'/newSaleOrder',component:Newsaleorder},
    ]}
  ]
})

//添加路由导航守卫 未登录则跳转到登录页
router.beforeEach((to,from,next)=>{
  if(to.path==='/') return next();
  const sessionStr = sessionStorage.getItem("user");
  if(!sessionStr) return next('/');
  return next();
})

export default router