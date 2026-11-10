import React from 'react';

export const typographyWords = language => language === 'en' ? {
  quoteTitle:'Quotation', quote:'Group related information and give it enough space so readers can find their next step with confidence.',
  quoteSource:'Original text for this catalog specimen',
  listsTitle:'Lists and instructions', bullets:['Keep related content together.','Use descriptive headings.','Check the layout on a narrow screen.'],
  steps:['Choose a component category.','Compare the same content across systems.','Read the official usage guidance.'],
  formattingTitle:'Inline formatting', subheading:'A smaller section heading',
  emphasis:'Important information', emphasisBody:' can be emphasized with bold text. ', italic:'A short aside', italicBody:' uses italic text. ',
  link:'Read the sample note',linkAfter:'. ', codeBefore:' The token ', codeAfter:' identifies a text size. Press ', keyAfter:' to move to the next control.',
  definitionsTitle:'Terms and notes', definitions:[['Design token','A named value shared across an interface, such as a color or a spacing unit.'],['Line height','The vertical space allocated to each line of text.']],
  note:'Sample note: quotation text and definitions are original examples for visual comparison.'
} : {
  quoteTitle:'引用', quote:'関連する情報をまとめて余白を整えることで読み手が次の操作を見つけやすくなります。',
  quoteSource:'このカタログの比較用サンプル文章',
  listsTitle:'箇条書きと手順', bullets:['関連する内容をひとまとまりにする。','内容が伝わる見出しを付ける。','狭い画面でもレイアウトを確認する。'],
  steps:['比較するコンポーネントのカテゴリを選ぶ。','システムを切り替えて同じ内容を見比べる。','公式の利用ガイドを確認する。'],
  formattingTitle:'文章内の書式', subheading:'小さなセクションの見出し',
  emphasis:'重要な情報', emphasisBody:'は太字で強調します。', italic:'補足の言葉', italicBody:'は斜体で表示しています。',
  link:'サンプルの注記を読む',linkAfter:'。', codeBefore:'トークンの ', codeAfter:' は文字サイズを表します。', keyAfter:' キーで次の操作対象に移動できます。',
  definitionsTitle:'用語と注記', definitions:[['デザイントークン','色や余白など画面全体で共有する値に名前を付けたもの。'],['行の高さ','一行の文字を表示するために確保する縦方向の領域。']],
  note:'注記：引用文と用語の説明は見た目を比較するためのオリジナルのサンプルです。'
};

const NativeText = ({as:Tag='p',...props}) => <Tag {...props}/>;
const NativeHeading = ({as:Tag='h2',...props}) => <Tag {...props}/>;
const NativeLink = props => <a {...props}/>;

// Typography comes from the adapter's published components/classes. Unsupported
// rich-text elements retain semantic browser defaults instead of an invented theme.
export default function TypographyExtras({t,classes={},Text=NativeText,Heading=NativeHeading,Link=NativeLink}) {
  const r=t.rich;
  const quoteText=<Text as="p" className={classes.quoteBody||classes.body}>{r.quote}</Text>;
  const citation=<cite className={classes.citation}>{r.quoteSource}</cite>;
  return <div className={`specimen-rich-text ${classes.body||''}`}>
    <section>
      <Heading as="h2" className={classes.heading}>{r.quoteTitle}</Heading>
      {classes.quoteLayout==='figure'?<figure className={classes.quote}><blockquote>{quoteText}</blockquote><figcaption>{citation}</figcaption></figure>:<blockquote className={classes.quote}>{quoteText}{citation}</blockquote>}
    </section>
    <section>
      <Heading as="h2" className={classes.heading}>{r.listsTitle}</Heading>
      <ul className={classes.list}>{r.bullets.map(text=><li className={classes.listItem} key={text}>{text}</li>)}</ul>
      <ol className={classes.orderedList}>{r.steps.map(text=><li className={classes.orderedListItem} key={text}>{text}</li>)}</ol>
    </section>
    <section>
      <Heading as="h2" className={classes.heading}>{r.formattingTitle}</Heading>
      <Heading as="h3" className={classes.subheading}>{r.subheading}</Heading>
      <Text as="p" className={classes.body}>
        <strong>{r.emphasis}</strong>{r.emphasisBody}<em>{r.italic}</em>{r.italicBody}
        <Link href="#specimen-reading-note" className={classes.link}>{r.link}</Link>{r.linkAfter}
        {r.codeBefore}<code>font-size</code>{r.codeAfter}<kbd>Tab</kbd>{r.keyAfter}
      </Text>
    </section>
    <section>
      <Heading as="h2" className={classes.heading}>{r.definitionsTitle}</Heading>
      <dl className={classes.definitions}>{r.definitions.map(([term,description])=><React.Fragment key={term}>
        <dt className={classes.term}>{term}</dt><dd className={classes.definition}>{description}</dd>
      </React.Fragment>)}</dl>
      <Text as="p" id="specimen-reading-note" className={classes.body}><small>{r.note}</small></Text>
    </section>
  </div>;
}
