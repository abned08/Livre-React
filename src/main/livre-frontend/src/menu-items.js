
const navigation= {
    items: [
        {
            id: 'home',
            title: 'Home',
            type: 'group',
            icon: 'icon-home',
            children: [
                {
                    id: 'default',
                    title: 'Home Page',
                    type: 'item',
                    url: '/home',
                    classes: 'nav-item',
                    icon: 'feather icon-home'
                }
            ]
        },
        {
            id: 'dossier',
            title: 'Dossier',
            type: 'group',
            icon: 'icon-folder',
            children: [
                {
                    id: 'dossier',
                    title: 'Dossier',
                    type: 'collapse',
                    icon: 'feather icon-folder',
                    children: [
                            {
                                id: 'dossierAdd',
                                title: 'Add',
                                type: 'item',
                                url: '/addDossier',
                                icon: 'fas fa-folder-plus'
                            },
                            {
                                id: 'dossierList',
                                title: 'List',
                                type: 'item',
                                url: '/dossiers',
                                icon: 'fas fa-th-list'
                            }
                    
                    ]


                }]},
        {
            id: 'report',
            title: 'Report',
            type: 'group',
            icon: 'feather icon-printer',
            children: [
                {
                    id: 'report',
                    title: 'Report',
                    type: 'collapse',
                    icon: 'feather icon-printer',
                    children: [
                        {
                            id: 'oneStop',
                            title: 'OneStop',
                            type: 'item',
                            url: '/oneStop',
                            icon: 'feather icon-log-in'
                        },
                        {
                            id: 'periodic',
                            title: 'Periodic',
                            type: 'item',
                            url: '/periodic',
                            icon: 'feather icon-calendar'
                        },
                        {
                            id: 'rationalization',
                            title: 'Rationalization',
                            type: 'item',
                            url: '/rationalization',
                            icon: 'feather icon-check-square'
                        }

                    ]

                },
            ]
        },
        // {
        //     id: 'landRegister',
        //     title: 'Land register',
        //     type: 'group',
        //     icon: 'icon-book',
        //     children: [
        //         {
        //             id: 'lr',
        //             title: 'Land register',
        //             type: 'collapse',
        //             icon: 'feather icon-book',
        //             children: [
        //                     {
        //                         id: 'lrAdd',
        //                         title: 'Add',
        //                         type: 'item',
        //                         url: '/addLivre',
        //                         icon: 'fas fa-book'
        //                     },
        //                     {
        //                         id: 'landRegisterList',
        //                         title: 'List',
        //                         type: 'item',
        //                         url: '/livres',
        //                         icon: 'fas fa-th-list'
        //                     }
        //
        //             ]
        //
        //
        //         },
        //
        //     ]
        // }
        
    ]
}

export default navigation
