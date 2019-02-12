// 导出页面为PDF格式
 import html2Canvas from 'html2canvas'
 import JsPDF from 'jspdf'
 export default{
   install (Vue, options) {
     Vue.prototype.getPdf = function (name) {
       var title = name;
       var dome = document.querySelector('#jpgDom');
       dome.style.paddingLeft='40px';
       dome.style.marginLeft='-40px';
       html2Canvas(dome, {
         allowTaint: true
       }).then(function (canvas) {
       	/*下载jpg*/
       	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = canvas.toDataURL('image/jpeg', 1.0).replace("image/jpeg", "image/octet-stream");
        save_link.download = title+'.jpg';
		var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
        dome.style.paddingLeft='0';
        dome.style.marginLeft='0';
         /*下载pdf
         let contentWidth = canvas.width
         let contentHeight = canvas.height
         let pageHeight = contentWidth / 592.28 * 841.89
         let leftHeight = contentHeight
         let position = 0
         let imgWidth = 595.28*0.9
         let imgLeft = 595.28*0.05
         let imgHeight = (592.28 / contentWidth * contentHeight)*0.9
         let pageData = canvas.toDataURL('image/jpeg', 1.0)
         let PDF = new JsImage('', 'pt', 'a4')
         PDF.addImage(pageData, 'JPEG', imgLeft, 0, imgWidth, imgHeight)
         if (leftHeight < pageHeight) {
           PDF.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight)
         } else {
           while (leftHeight > 0) {
             PDF.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
             leftHeight -= pageHeight
             position -= 841.89
             if (leftHeight > 0) {
               PDF.addPage()
             }
           }
         }
         PDF.save(title + '.pdf')*/
       }
       )
       
     }
   }
 }