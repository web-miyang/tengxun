dim FileName,fs,foldername,script

Set fs = CreateObject("scripting.filesystemobject")
digui ("static")'调用递归函数进行查找
  script="var members = ["&FileName&"];"
  set ttfile=fs.opentextfile("members.js",2)
 ttfile.writeline(script)
 ttfile.close
	'下面是递归查找函数
Function digui(path)
    Set folder = fs.getfolder(path)
    Set Files = folder.Files
    For Each i In Files
        FileName=FileName &Chr(34)& i.name&Chr(34)&","  '找到则追加到变量FileName中
    Next
End Function