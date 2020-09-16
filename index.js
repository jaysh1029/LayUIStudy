layui.loadLib('jquery', {
    particles: "Lib/particles"
}, function () {
    $("#j1,#j2").jParticle({
        background: "green",
        color: "#E6E6E6"
    });
});

console.log(layui.router('http://www.xxx.com/start/#/home/homepage1?action=aa&dd=s#top'))