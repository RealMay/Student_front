const app = new Vue({
    el:'#app',
    data:{
        students:[],
        pageStudents:[],
        baseURL:"http://172.28.35.33:8000/",
        inputStr:"",
        dialogVisible:false,


        //分页相关的变量
        total:0,//数据总行数
        currentpage:1, //当前所在的页
        pagesize:10 ,  //每页显示多少行

    },
    mounted() {
        //自动加载数据
        this.getStudents();
    },
    methods: {
        //获取所有学生信息
        getStudents:function(){
            //记录this的地址
            let that = this
            //使用axios实现Ajax请求
            axios
            .get(that.baseURL + "students/")
            .then(function(res){
                //请求成功的函数
                // console.log(res);
                if (res.data.code === 1){
                    //把数据给students
                    that.students = res.data.data;
                    //获取返回记录的总行数
                    that.total = res.data.data.length;
                    //获取当前页的数据
                    that.getPageStudents();
                    //提示
                    that.$message({
                        message: '数据加载成功',
                        type: 'success'
                      });
                }else{
                    //失败的提示
                    that.$message.error(res.data.msg);
                }
            })
            .catch(function(err){
                //请求失败的函数
                console.log(err)
            })
        },
        getAllStudents(){
            this.inputStr = "";
            this.getStudents();
        },
        getPageStudents(){
            //清空pageStudents的值
            this.pageStudents = [];
            //获得当前页的数据
            for(let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++){
                //把遍历数据添加到pageStudent
                this.pageStudents.push(this.students[i]);
                //判断是否达到一页的要求
                if(this.pageStudents.length === this.pagesize) break;
            }
        },
        //实现学生信息查询
        queryStudent(){
            //使用Ajax请求，post,传递inputStr
            let that = this
            axios
            .post(
                that.baseURL + "students/query/",
                {   
                    //把输入的inputStr传给后台
                    inputstr:that.inputStr
                }
            )
            .then(function(res){
                if(res.data.code === 1){
                    //把数据给students
                    that.students = res.data.data;
                    //获取返回记录的总行数
                    that.total = res.data.data.length;
                    //获取当前页的数据
                    that.getPageStudents();
                    //提示
                    that.$message({
                        message: '查询数据加载成功',
                        type: 'success'
                      });
                }else{
                    //失败的提示
                    that.$message.error(res.data.msg);
                }
            }
            )
            .catch(function(err){
                console.log(err)
                that.$message.error("获取后端查询接口异常");
            })

        },
        //添加学生时打开表单
        addStudent(){
            this.dialogVisible = true
        },
        //分页时修改每页的行数
        handleSizeChange(size){
            //修改当前每页数据行数
            this.pagesize = size;
            //数据重新加载
            this.getPageStudents();
        },
        //调整当前页码
        handleCurrentChange(pageNumber){
            this.currentpage = pageNumber;
            //数据重新加载
            this.getPageStudents();
        }
    },
})