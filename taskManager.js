$('document').ready(() => {
    const queue = [];
    var taskbar = document.getElementById("taskbar");
    var interval;
    var taskId = 0;
    var processing = false;
    var servers = {};
    var serverCnt = 0;

    $('#addServerBtn').click(function(){
        console.log(Object.keys(servers).length);
        if(Object.keys(servers).length >= 10){
            alert("Can not add more than 10 servers");
            return false();
        }
        serverCnt++;
        servers["server-"+serverCnt] = "";
        $(".server-status").html(JSON.stringify(servers));
        processTask();
    });

    $('#createTaskButton').click(function(){
        var tasksAdded = $('#inputtask').val();
        for(i=1; i<=tasksAdded; i++) {
            taskId++;
            console.log("Task Id:"+taskId);
            queue.push('task-'+taskId);
            console.log(JSON.stringify(queue));            
            addProgressBar(taskId);
        }

        processTask();
        // alert("task added"+ tasksAdded);
    });

    function addProgressBar(taskId) {
        var progressBar = '<div class="row mx-lg-n5 task-progress-div" task-id="task-'+taskId+'">'
            progressBar += '<div class="col-sm-10">'
            progressBar += '<div class="progress progress-'+taskId+'" style="margin-top:5px; margin-left:-20px; height:20px width:70">';
            progressBar += '<div class="progress-bar progress-bar-purple" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="task-'+taskId+'">0%</div>';
            progressBar += '<div class="server-'+taskId+'"></div>'
            progressBar += '</div>'
            progressBar += '</div>'
            progressBar += '<div class="col-sm-2">'
            progressBar += '<i class="far fa-trash-alt deleteTaskBtn" style="size: 20px; color:#987BBB;" task-id="task-'+taskId+'" id="delete-task-'+taskId+'"></i>'
            progressBar += '</div>'
            progressBar += '</div>';
        $(".task-progress").append(progressBar);    
    }


    function processTask(){
        if(Object.keys(servers).length == 0) {
            return false;
        }

        if(queue.length == 0) {
            return false;
        }

        $.each(servers,function(index, value){
            console.log("print in foreach")
            console.log(index);
            console.log(value);
            if(value == "") {
                thread();
            }
        });

        if(processing == true) {
            return false;
        }
        processing = true;
        //thread();
    }

    function thread() {
        var taskId = queue[0];
        var selectedServer = '';
        $.each(servers,function(index, value){
            console.log("print in foreach")
            console.log(index);
            console.log(value);
            if(value == "") {
                servers[index] = taskId;
                selectedServer = index;
                return false;
            }
        });
        $(".server-status").html(JSON.stringify(servers));
        queue.splice(0,1);
        $("#delete-"+taskId).hide();

        console.log(servers);
        //alert("pregress : "+taskId);
        console.log("progress : "+taskId);
        taskProgressBar(taskId, selectedServer);
        
        setTimeout(function(){
            //alert("task finished:"+ queue[0]);
            console.log("task finished:"+ taskId);
            $.each(servers,function(index, value){
                if(value == taskId) {
                    servers[index] = "";
                    $(".server-status").html(JSON.stringify(servers));
                    return false;
                }
            });
            console.log(servers);
            console.log(JSON.stringify(queue));
            $(".server-status").html(JSON.stringify(servers));
            if(queue.length>0) {
                thread();
            } else {
                processing = false; 
            }    
        }, 10000);

    }

    function taskProgressBar(taskId, server) {
        //resetProgressBar();
        //alert(taskId);
        
        console.log("server:"+server);
        var taskSecond = 1;
        $(".server-"+taskId).append(server);
        //console.log($(".server-"+taskId).html());
        var interval = setInterval(function(){
            //console.log(taskId);
            var percent = (taskSecond*10)+"%";
            if((taskSecond*5) > 100) {
                percent = "100%";
            }
            $("#"+taskId).css('width',percent);
            $("#"+taskId).html(percent);
            taskSecond++;
            console.log("task - "+taskId+" == seconds : "+taskSecond);
            if(taskSecond >= 11) {
                clearInterval(interval);
                return false;
            }
        }, 1000);        
        return false;
    }

    $(document).on("click", ".deleteTaskBtn" , function() {
    //$('.deleteTaskBtn').click(function(){
        console.log("remove");
        deleteId = $(this).attr("task-id");
        console.log("removeId-"+deleteId);
        var removeIndex = queue.indexOf(deleteId);
        queue.splice(removeIndex,1);
        $('.task-progress-div[task-id='+deleteId+']').remove();
        console.log(JSON.stringify(queue));
    });

    $('#removeServerBtn').click(function(){
        if(Object.keys(servers).length == 0){
            return false;
        }
        var deleteServer = false;
        //while(true){
        var delServer= setInterval(function(){
            $.each(servers,function(index, value){
                if(value == "") {
                    delete servers[index];
                    deleteServer = true;
                    if(Object.keys(servers).length >= 0){
                        $(".server-status").html(JSON.stringify(servers));
                    }
                    return false;
                }
            });
            console.log(servers);
            if(deleteServer == true){
                clearInterval(delServer);
            }
            console.log("here in loop");
        },1000);
        $(".server-status").html(JSON.stringify(servers));
    });
});