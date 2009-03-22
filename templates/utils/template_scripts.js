  function LoadInit() {
if ('{{ load|default:"false" }}' == "false"){ return; } else { Loading({{ load }});}
}
LoadInit(); 





