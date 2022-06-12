// 기본설정
let sessionId = parseInt(Math.random()*1000000)
console.log('[sessionId]',sessionId)

function set(ar){out=[]; for(const v of ar) if (!out.includes(v)) out.push(v); return out}


function new_sessionId(id){
	sessionId = parseInt(Math.random()*1000000)
	let savedlist =  localStorage.getItem('list')
	if (savedlist){
		savedlist = JSON.parse(savedlist)
		savedlist = savedlist.filter(id=>localStorage.getItem(id))
		savedlist.push(sessionId)
	
	}
	else savedlist = []
	savedlist=set(savedlist)
	localStorage.setItem('list',JSON.stringify(savedlist))
	return sessionId
}

function get_saved_data(){
	
	let savedlist =  localStorage.getItem('list')
	if (savedlist){
		savedlist = JSON.parse(savedlist)
		savedlist = savedlist.filter(id=>localStorage.getItem(id))
		console.log(savedlist)
  		let id = prompt(savedlist.map((v,i)=>`${i}th, id:${v}, ${localStorage.getItem(v).split('\n').filter(v=>v.startsWith('title:'))[0]}`).join('\n'))
		if(id!=="" && Number.isInteger(id*1)){
			sessionId = savedlist[id]
			let data = localStorage.getItem(sessionId)
			//console.log('data',data,'sessionId',sessionId)
			if(data){parsetitle(data)}
			
		}else{console.log('id noint',id)
		}
    		
	}else savedlist = []
	savedlist.push(sessionId)
	savedlist=set(savedlist)
	localStorage.setItem('list',JSON.stringify(savedlist))
}

window.onload = get_saved_data




// 에디터 설정

const Editor = toastui.Editor;
// const codeSyntaxHighlight = Editor.plugin.codeSyntaxHighlight
const editor =  Editor.factory({
    el: document.querySelector('#editor'),
    height: '600px',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    // plugins:[codeSyntaxHighlight]
});


// 입력창 관련 함수 추가

const form = document.querySelector('#submit')
document.querySelector('#editor').addEventListener('keyup',e=>{
    const  md = editor.getMarkdown()
    const reg = /#([ \t]+[^\n]*)/
    document.getElementById('btn_body').value = md.replace(reg,'')
    const title = md.match(reg)
    if(title) document.getElementById('btn_title').value  =  title[1].trim()

    // 수식 변환
    if(document.getElementById('btn_mathjax').checked){
        //MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.querySelector('.toastui-editor-md-preview')])()
const node = document.querySelector('.toastui-editor-md-preview');
MathJax.typesetPromise([node]).then((d) => {
  // the new content is has been typeset
    //console.log(d)
});


// 자동저장

const outdata = exportdata()
if (outdata.out.title || outdata.out.body){
	console.log('autosave',sessionId)
	localStorage.setItem(sessionId, outdata.data);
}


}


    const list = document.getElementsByTagName('code')
    if(list){
        for (const ele of list) if(ele.children.length==0) hljs.highlightElement(ele)
    }
    // 
})
form.addEventListener('submit',e=>{
    e.preventDefault()
    
const data = exportdata().data
copy2(data)
})


function exportdata(){

const out = {}
    for (const i of form.querySelectorAll('input')) if(i.name){
        if(i.type!='checkbox') out[i.name] = i.value
        else out[i.name] = i.checked
    } 
    out['category'] = document.getElementById('btn_category').value

const data = `---
layout: ${out.layout}
mathjax: ${out.mathjax}
highlightjs: ${out.highlightjs}
title: "${out.title}"
category: "${out.category}"
---
${out.body}
`

document.title = out.title

return {out, data}
}


//function importsaveddata(title){
//const data =  localStorage.getItem(title)
//if (data){
//parsetitle(data)
//}
//}

function parsetitle(str){
    const ar =  str.split(/^-{3,}|(?<=\n)-{3,}/gi)
    console.log(str,ar)
    const title = ar[1].match(/title:(\s*)("?)([^"]+)("?)/)[3].trim()
    // const title = ar[1].match(/title:(\s*)"(.+)"/)[2]
    const body = `# ${title}`+'\n'+ar[2].trim()
    if(title) document.getElementById('btn_title').value  =  title
    editor.setMarkdown(body)
    const category = ar[1].match(/category:(\s*)("?)([^"]+)("?)/)[3].trim()
    document.getElementById('btn_category').value = category
}

// blog 형식의 text를 입력받는 부분

const input_pre = document.getElementById('input_pre')
const header = document.getElementById('header')
input_pre.addEventListener('click',e=>{
    input_pre.disabled = true
    const t = document.createElement("textarea");
    
    header.appendChild(t);
    console.log(t,input_pre, header.appendChild(t))
    // document.body.appendChild(t);
    t.addEventListener('change',()=>{
        input_pre.disabled = false
        const data = t.value
        t.remove()
        try{
            new_sessionId()
            parsetitle(data)
        }catch(e){alert(e)}
    })
    // document.body.removeChild(t);
})



