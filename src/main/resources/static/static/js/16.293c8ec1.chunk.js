(this["webpackJsonplivret-foncier"]=this["webpackJsonplivret-foncier"]||[]).push([[16],{708:function(e,t,n){"use strict";n.r(t);var c=n(63),r=n(8),a=n(2),i=n(64),l=n(42),o=n(1027),s=n(917),u=n(1048),j=n(1043),d=n(1028),b=n(1015),m=n(380),O=n.n(m),h=n(1011),x=n(377),f=n.n(x),g=n(1014),p=n(82),v=n(771),y=n(628),w=n.n(y),C=n(1012),S=n(1032),F=n(1019),k=n(1025),N=n(1020),E=n(387),P=n.n(E),T=n(385),z=n(629),A=n(3),R=n(672),I=n(711),D=n(766),_=n(712),L=n(1050),V=n(1017),W=n(1018),B=n(707),G=n(1026),H=n(375),q=n(794),J=n(11),Z=Object(g.a)((function(e){return{rootForProg:{display:"flex","& > * + *":{marginLeft:e.spacing(2)},justifyContent:"center"},paper:{marginTop:e.spacing(2),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},form:{width:"100%",marginTop:e.spacing(1)}}})),K={communeName:""},U=z.b().shape({communeName:z.c().required("required")});function $(e){return Object(J.jsx)(I.a,Object(r.a)({elevation:6,variant:"filled"},e))}t.default=function(){var e,t=Z(),n=Object(q.a)().t,r=Object(a.useState)(!1),m=Object(c.a)(r,2),g=m[0],y=m[1],E=Object(a.useState)(!1),z=Object(c.a)(E,2),M=z[0],Q=z[1],X=Object(H.c)({defaultValues:K,mode:"onChange",resolver:Object(T.a)(U)}),Y=X.register,ee=X.handleSubmit,te=X.setValue,ne=X.reset,ce=X.errors,re=Object(l.c)(),ae=Object(l.d)((function(e){return{communes:e.commune.communes,loading:e.commune.loading,error:e.commune.error}})),ie=ae.communes,le=ae.loading,oe=ae.error,se=Object(a.useRef)(null),ue=Object(a.useRef)(null),je=Object(a.useState)(!1),de=Object(c.a)(je,2),be=de[0],me=de[1],Oe=function(){me((function(){return!1})),ne(K),ue.current=null},he=Object.keys(K),xe=function(e,t){"clickaway"!==t&&Q((function(){return!1}))};Object(a.useEffect)((function(){null==ue.current&&(ne(K),se.current.instance.deselectAll())}),[ue,ne]),Object(a.useEffect)((function(){re(Object(p.d)()),oe&&(y(!0),setTimeout((function(){y(!1)}),5e3))}),[re,oe,ne]);var fe=Object(a.useCallback)((function(e){return n("count")+": "+e.value}),[n]);return Object(J.jsxs)(i.a,{children:[Object(J.jsxs)(L.a,{open:be,onClose:Oe,"aria-labelledby":"form-dialog-title",children:[Object(J.jsx)(V.a,{id:"form-dialog-title",children:n("delete")}),Object(J.jsx)(W.a,{children:Object(J.jsx)(B.a,{children:n("ask_delete")})}),Object(J.jsxs)(G.a,{children:[Object(J.jsx)(k.a,{onClick:Oe,color:"primary",children:n("cancel")}),Object(J.jsx)(k.a,{onClick:function(e){return re(Object(p.c)(ue.current.id)).then(A.d),ue.current=null,void me((function(){return!1}))},color:"primary",children:n("delete")})]})]}),Object(J.jsx)(o.a,{children:Object(J.jsx)(s.a,{children:Object(J.jsxs)(u.a,{children:[Object(J.jsxs)(u.a.Header,{style:{display:"flex",justifyContent:"space-between"},children:[Object(J.jsx)(u.a.Title,{as:"h5",children:n("communes")}),Object(J.jsx)(d.a,{title:n("reset_filters"),children:Object(J.jsx)(b.a,{size:"small",color:"primary","aria-label":"clear all filters",onClick:function(){se.current.instance.clearFilter()},children:Object(J.jsx)(O.a,{})})})]}),Object(J.jsxs)(u.a.Body,{children:[Object(J.jsx)(R.a,{in:g,children:Object(J.jsxs)(I.a,{variant:"filled",severity:"error",children:[Object(J.jsx)(D.a,{children:"Error"}),"There is an error \u2014 ",Object(J.jsx)("strong",{children:oe})]})}),Object(J.jsx)(_.a,{open:M,autoHideDuration:4e3,anchorOrigin:{vertical:"top",horizontal:"right"},onClose:xe,children:Object(J.jsx)($,{onClose:xe,severity:"success",children:n("saved_successfuly")})}),Object(J.jsxs)(o.a,{children:[Object(J.jsx)(s.a,{xs:12,md:4,children:Object(J.jsxs)("div",{className:t.paper,children:[Object(J.jsx)(v.a,{className:t.avatar,children:Object(J.jsx)(w.a,{})}),Object(J.jsxs)(C.a,{component:"h1",variant:"h5",children:[ue.current?n("edit"):n("add")," ",n("commune")]}),le?Object(J.jsx)(S.a,{}):Object(J.jsxs)("form",{className:t.form,noValidate:!0,onSubmit:ee((function(e){return ue.current?function(e){e.id=ue.current.id,re(Object(p.e)(e)).then(A.d).then(Q((function(){return!0}))),ue.current=null}(e):function(e){re(Object(p.a)(e)).then(A.d).then(Q((function(){return!0}))),ue.current=null}(e)})),children:[Object(J.jsx)(j.a.Row,{children:Object(J.jsx)(j.a.Group,{as:s.a,xs:12,children:Object(J.jsx)(F.a,{container:!0,spacing:2,children:Object(J.jsx)(F.a,{item:!0,xs:12,children:Object(J.jsx)(N.a,{onChange:function(e){return/^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_]*$/.test(e.target.value)?e.target.value:e.target.value=""},variant:"outlined",margin:"normal",inputRef:Y,InputLabelProps:ue.current&&{shrink:!0},fullWidth:!0,autoFocus:!0,label:n("commune"),name:"communeName",error:!!ce.communeName,helperText:n(null===(e=ce.communeName)||void 0===e?void 0:e.message)})})})})}),Object(J.jsx)(F.a,{container:!0,spacing:2,children:Object(J.jsx)(F.a,{item:!0,xs:12,children:Object(J.jsx)(k.a,{type:"submit",variant:"contained",color:"primary",fullWidth:!0,size:"large",className:t.button,startIcon:Object(J.jsx)(P.a,{}),children:n("save")})})})]})]})}),Object(J.jsx)(s.a,{xs:12,md:8,className:t.rootForProg,children:Object(J.jsx)(h.a,{children:Object(J.jsxs)(f.a,{id:"dataGrid",ref:se,dataSource:ie,keyExpr:"id",focusedRowEnabled:!0,defaultSelectedRowKeys:null,onSelectionChanged:function(e){var t=e.selectedRowsData;ue.current=t[0],ue.current&&he.forEach((function(e){return te(e,ue.current[e],{shouldValidate:!0,shouldDirty:!0})}))},allowColumnReordering:!0,showRowLines:!0,wordWrapEnabled:!0,columnHidingEnabled:!0,columnAutoWidth:!0,children:[Object(J.jsx)(x.Sorting,{mode:"multiple"}),Object(J.jsx)(x.LoadPanel,{enabled:le}),Object(J.jsx)(x.SearchPanel,{visible:!0,width:250,placeholder:n("search")}),Object(J.jsx)(x.Paging,{defaultPageSize:10}),Object(J.jsx)(x.Pager,{showPageSizeSelector:!0,showNavigationButtons:!0,allowedPageSizes:[5,15,20,100],showInfo:!0}),Object(J.jsx)(x.Column,{dataField:"communeName",caption:n("commune")}),Object(J.jsx)(x.Column,{type:"buttons",children:Object(J.jsx)(x.Button,{name:"delete",onClick:function(e){return t=e,ue.current=t.row.data,void me((function(){return!0}));var t}})}),Object(J.jsx)(x.ColumnChooser,{enabled:!0,mode:"select",title:n("Column_chooser")}),Object(J.jsx)(x.Selection,{mode:"single"}),Object(J.jsx)(x.Editing,{allowUpdating:!1,allowDeleting:!0,allowAdding:!1}),Object(J.jsxs)(x.Summary,{children:[Object(J.jsx)(x.GroupItem,{summaryType:"count"}),Object(J.jsx)(x.TotalItem,{column:"communeName",summaryType:"count",customizeText:fe})]})]})})})]})]})]})})})]})}}}]);
//# sourceMappingURL=16.293c8ec1.chunk.js.map