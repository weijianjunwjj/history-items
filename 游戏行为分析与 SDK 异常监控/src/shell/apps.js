/** Local microfrontend registry. Each app also has an independent HTML/build entry. */
export const applications=[
 {name:'journey',title:'业务与技术导览',defaultPath:'/journey',match:p=>p.startsWith('/journey'),load:()=>import('../apps/journey/index.js')},
 {name:'monitor',title:'SDK监控',defaultPath:'/monitor/overview',match:p=>p==='/monitor/overview',load:()=>import('../apps/monitor/index.js')},
 {name:'report',title:'日志上报配置',defaultPath:'/report/events',match:p=>p.startsWith('/report/'),load:()=>import('../apps/report/index.js')},
 {name:'ebi',title:'EBI行为分析',defaultPath:'/ebi/funnel',match:p=>p.startsWith('/ebi/'),load:()=>import('../apps/ebi/index.js')},
 {name:'crm',title:'CRM营销配置',defaultPath:'/crm/activities',match:p=>p==='/crm/activities',load:()=>import('../apps/crm/index.js')},
 {name:'workbench',title:'工作复盘',defaultPath:'/workbench',match:p=>p==='/workbench'||p.startsWith('/workbench/'),load:()=>import('../apps/workbench/index.js')}
];
