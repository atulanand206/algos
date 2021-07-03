const fr = (username, link) => {
  return <iframe
    className='item-frame'
    scrolling="no"
    title=""
    src={`https://codepen.io/${username}/embed/${link}?defaultTab=css%2Cresult`}
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true">See the Pen <a href={`https://codepen.io/${username}/pen/${link}`}>
    </a> by Atul Anand (<a href="https://codepen.io/atulanand206">@atulanand206</a>)
    on <a href="https://codepen.io">CodePen</a>.
  </iframe>
}

const f1 = fr('atulanand206', 'RwVWjXK')
const f2 = fr('atulanand206', 'dyWYJYp')

export const frames = [f1, f2, f1]