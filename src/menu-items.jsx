const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Funcionalidades',
      type: 'group',
      icon: 'icon-navigation',
      children: [

        {
          id: 'home',
          title: 'Home',
          type: 'item',
          icon: 'feather icon-home',
          url: '/'
        },
        {
          id: 'sales',
          title: 'Ventas',
          type: 'item',
          icon: 'feather icon-briefcase',
          url: '/sales'
        },
        {
          id: 'saleslist',
          title: 'Historial de Ventas',
          type: 'item',
          icon: 'feather icon-clipboard',
          url: '/saleslist'
        }
        ,
        {
          id: 'products',
          title: 'Gestion Productos',
          type: 'item',
          icon: 'feather icon-clipboard',
          url: '/products'
        }
      ]
    },
    {
      id: 'purchases',
      title: 'Compras',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'register-purchases',
          title: 'Registrar Compra',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/purchases'
        },
        {
          id: 'purchases-tables',
          title: 'Historial Compras',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/purchases-list'
        }
      ]

    },
    //bloque para la sección de clientes
    {
      id: 'customer',
      title: 'Clientes',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'register-customer',
          title: 'Registrar Cliente',
          type: 'item',
          icon: 'feather icon-user',
          url: '/customer'
        },
        {
          id: 'customer-tables',
          title: 'Buscar Cliente',
          type: 'item',
          icon: 'feather icon-user',
          url: '/customer-list'
        },

      ]

    },
    //Bloque de informes
    {
      id: 'reports',
      title: 'Informes',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'report_purchases',
          title: 'Informe Compra',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/reportPurchases'
        },
        {
          id: 'report_sales',
          title: 'Informe Ventas',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/salesReport'
        }
      ]

    },
  ]
};

export default menuItems;
