const app = new Vue({
    el: '#app',
    data() {
        //校验学号是否存在
        const rulesSno = (rule, value, callback) => {
            //使用axios校验
            axios.post(
                this.baseURL + 'sno/check/',
                {
                    sno: value,
                }
            )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (res.data.exist) {
                            callback(new Error("学号已存在！"));
                        } else {
                            callback();
                        }
                    } else {
                        callback(new Error("后端异常"))
                    }

                })
                .catch((err) => {
                    //请求失败后台打印
                    console.log(err);
                });
        }
        return {
            students: [],
            pageStudents: [],
            baseURL: "http://172.28.35.33:8000/",
            inputStr: "",
            dialogVisible: false,
            dialogTittle: "",
            isEdit: false, //标识是否修改
            isView: false, //表示是否查看
            //分页相关的变量
            total: 0,//数据总行数
            currentpage: 1, //当前所在的页
            pagesize: 10,  //每页显示多少行
            studentForm: {
                sno: "",
                name: "",
                gender: "",
                birthday: "",
                mobile: "",
                email: "",
                address: "",
                image: "",
            },
            rules: {
                sno: [
                    { required: true, message: '学号不允许为空', trigger: 'blur' },
                    { pattern: /^[9][5]\d{3}$/, message: '学号必须以95开头的5个数字', trigger: 'blur' },
                    { validator: rulesSno, trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '姓名不允许为空', triggler: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名必须2-5汉字', trigger: 'blur' },
                ],
                gender: [
                    { required: true, message: '性别不允许为空', trigger: 'change' },
                ],
                birthday: [
                    { type: 'date', required: true, message: '日期不允许为空', trigger: 'change' },
                ],
                mobile: [
                    { required: true, message: '手机号码不允许为空', trigger: 'blur' },
                    { pattern: /^[1][35789]\d{9}$/, message: '手机号码要符合规范', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '邮箱不允许为空', trigger: 'blur' },
                    { pattern: /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/, message: '邮箱要符合规范', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '地址不允许为空', trigger: 'blur' },
                ],
            }
        }

    },
    mounted() {
        //自动加载数据
        this.getStudents();
    },
    methods: {
        //获取所有学生信息
        getStudents: function () {
            //记录this的地址
            let that = this
            //使用axios实现Ajax请求
            axios
                .get(that.baseURL + "students/")
                .then(function (res) {
                    //请求成功的函数
                    // console.log(res);
                    if (res.data.code === 1) {
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
                    } else {
                        //失败的提示
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(function (err) {
                    //请求失败的函数
                    console.log(err)
                })
        },
        getAllStudents() {
            this.inputStr = "";
            this.getStudents();
        },
        getPageStudents() {
            //清空pageStudents的值
            this.pageStudents = [];
            //获得当前页的数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                //把遍历数据添加到pageStudent
                this.pageStudents.push(this.students[i]);
                //判断是否达到一页的要求
                if (this.pageStudents.length === this.pagesize) break;
            }
        },
        //实现学生信息查询
        queryStudent() {
            //使用Ajax请求，post,传递inputStr
            let that = this
            axios
                .post(
                    that.baseURL + "students/query/",
                    {
                        //把输入的inputStr传给后台
                        inputstr: that.inputStr
                    }
                )
                .then(function (res) {
                    if (res.data.code === 1) {
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
                    } else {
                        //失败的提示
                        that.$message.error(res.data.msg);
                    }
                }
                )
                .catch(function (err) {
                    console.log(err)
                    that.$message.error("获取后端查询接口异常");
                })

        },
        //添加学生时打开表单
        addStudent(row) {
            this.dialogVisible = true;
            this.dialogTittle = "添加学生明细"
        },
        //查询学生明细
        viewStudent(row) {
            this.dialogTittle = "查询学生明细"
            //修改isView的变量
            this.isView = true;
            this.dialogVisible = true;
            // console.log(row)
            this.studentForm = JSON.parse(JSON.stringify(row))
        },
        //修改学生的明细
        updateStudent(row) {
            this.dialogTittle = "修改学生明细"
            //修改isEdit变量
            this.isEdit = true;
            this.dialogVisible = true;
            // 深拷贝方法
            this.studentForm = JSON.parse(JSON.stringify(row))
        },
        //提交和修改学生信息
        submitStudentForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //关闭弹出框的表单
        closeDialogForm(formName) {
            //清空
            this.$refs[formName].resetFields();
            this.studentForm.sno = "";
            this.studentForm.name = "";
            this.studentForm.gender = "";
            this.studentForm.birthday = "";
            this.studentForm.mobile = "";
            this.studentForm.email = "";
            this.studentForm.address = "";
            this.dialogVisible = false;
            //关闭后要初始化isView和isEdit
            this.isView = false;
            this.isEdit = false;
        },
        //分页时修改每页的行数
        handleSizeChange(size) {
            //修改当前每页数据行数
            this.pagesize = size;
            //数据重新加载
            this.getPageStudents();
        },
        //调整当前页码
        handleCurrentChange(pageNumber) {
            this.currentpage = pageNumber;
            //数据重新加载
            this.getPageStudents();
        }
    },

})