import React from'react';
export const tableData=t=>t.tableRows.map((row,index)=>({id:String(index),name:row[0],owner:row[1],status:row[2]}));
export const tableColumns=t=>t.tableHeaders.map((title,index)=>({title,dataIndex:['name','owner','status'][index],key:['name','owner','status'][index]}));
export default function tableKit({Table='table',Head='thead',Body='tbody',Row='tr',Header='th',Cell='td'}){
 return ({t})=><Table aria-label={t.tableTitle}><Head><Row>{t.tableHeaders.map((label,i)=><Header key={i}>{label}</Header>)}</Row></Head><Body>{t.tableRows.map((row,i)=><Row key={i}>{row.map((value,j)=><Cell key={j}>{value}</Cell>)}</Row>)}</Body></Table>;
}
