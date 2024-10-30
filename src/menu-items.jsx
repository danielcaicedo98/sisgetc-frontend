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
          id: 'reports',
          title: 'Reportes',
          type: 'item',
          icon: 'feather icon-clipboard',
          url: '/reports'
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

    }
  ]
};

export default menuItems;
