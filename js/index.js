var params = (() => {
  var params = {}
  for( let param of window.location.search.slice( 1 ).split( "&" )){
    let [key, value] = param.split( "=" )
    params[ key ] = decodeURIComponent( value )
  }
  return params
})()
$( document ).ready( () => {
  $( "#search" ).val( params[ "search" ] )
  // 请求数据源
  $.getJSON( "source.json", ( dt ) => {
    $( "#contain" ).html( "" )
    Qmsg.success( "已开始搜索，您可能需要等待一会喵w！" )
    $.each( dt, ( i, site ) => {
      let now = Math.floor(performance.now())
      $.getJSON( "https://api.ahfi.cn/api/websiteinfo?url=" + encodeURIComponent( site.url ), ( web ) => {
        if( (web.data.title + web.data.description + web.data.keywords + site.url + (site.info || "" )).toLowerCase().includes( params[ "search" ].toLowerCase() ) ){
          let card = $( `<div class="card">
            <img src="${web.data.ico_url}" class="icon" onerror="this.src = 'imgs/site.png'">
            <h4 class="title">${web.data.title || site.url}</h4>
            <a>(${new URL(site.url).hostname})</a>
            <div>${(web.data.description || site.info) || ""}</div>
            <div align="right">
              <font color="${web.code <= 300 ? "green" : ( web.code <= 400 ? "yellow" : "red")}" size=2>${web.code} & ${Math.floor(performance.now()) - now}ms</font>
            </div>
          </div>` )
          card.click( () => {
            window.location.href = site.url
          })
          $( "#contain" ).append( card )
        }
      })
    })
    setTimeout( () => {
      $( "#contain" ).append( $( "<div>如果找不到想找的镜像站可以换个关键词喵<br>当然也欢迎向MirrorLine提交缺少的镜像站 :)</div>" ) )
    }, 5000)
  })
})