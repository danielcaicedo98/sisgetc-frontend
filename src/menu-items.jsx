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
          id: 'purchases',
          title: 'Compras',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/purchases'
        },
        {
          id: 'reports',
          title: 'Reportes',
          type: 'item',
          icon: 'feather icon-clipboard',
          url: '/reports'
        }
      ]
    }
  ]
};

export default menuItems;
