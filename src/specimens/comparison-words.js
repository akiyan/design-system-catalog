const codeSample = `const project = {
  name: "Design system catalog",
  visibility: "team",
  notifications: true,
};

export function publish(project) {
  return { ...project, status: "published" };
}`;
const translations = {
 ja: {
  openDialog:'ダイアログを開く',
  dialogTitle:'プロジェクトを公開しますか？',
  dialogBody:'最新のコンポーネントとガイドラインをチームに公開します。公開後もアクセス権を変更できます。',
  publish:'公開する',
  badges:['公開済み','確認中','下書き'],
  cardTitles:['コンポーネントライブラリ','デザインガイドライン'],
  cardBodies:['次のプロジェクトで使える共通部品。Akiが本日更新しました。','共通のパターンとアクセシビリティ方針。Mikaが昨日更新しました。'],
  codeTitle:'コードブロック',
  chat:'チャット',message:'メッセージ',send:'送信',
  messages:[
   {author:'Aki',self:true,text:'新しいコンポーネントを今日公開できますか？'},
   {author:'Mika',self:false,text:'アクセシビリティの確認が終わりました。フォームとナビゲーションも公開できます。'},
   {author:'Aki',self:true,text:'ありがとうございます！チームに更新を共有します。'}
  ]
 },
 en: {
  openDialog:'Open dialog',
  dialogTitle:'Publish this project?',
  dialogBody:'The latest components and guidelines will become available to your team. You can change access later.',
  publish:'Publish',
  badges:['Published','In review','Draft'],
  cardTitles:['Component library','Design guidelines'],
  cardBodies:['Reusable components for your next project. Updated today by Aki.','Shared patterns and accessibility guidance. Updated yesterday by Mika.'],
  codeTitle:'Code block',
  chat:'Chat',message:'Message',send:'Send',
  messages:[
   {author:'Aki',self:true,text:'Can we publish the new components today?'},
   {author:'Mika',self:false,text:'The accessibility review is complete. The forms and navigation are ready.'},
   {author:'Aki',self:true,text:'Thanks! I will share the update with the team.'}
  ]
 }
};
export const comparisonWords = language => ({...translations[language==='en'?'en':'ja'],codeSample});
