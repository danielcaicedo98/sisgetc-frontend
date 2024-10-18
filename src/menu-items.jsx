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

    }
  ]
};

export default menuItems;
