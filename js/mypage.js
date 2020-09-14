function myPage(ref){
    this.ele = ref.ele;             //获取当前元素
    this.count = ref.count;         //总共多少页
    this.fun = ref.fun || function(){};             //回调函数
    this.curpage = ref.curpage || 1;     //当前页
    this.pageSize = ref.pageSize || 5;  //分页个数
    this.dataTotal = ref.dataTotal;     //总共多少数据
    this.ul = document.createElement('ul');
    this.amountArr = ref.amountArr || [5,10,15,20,30,50];
}

myPage.prototype = {
    init:function(pageAmount,curPage){
        // 初始化控件
        var _this = this;
        _this.pageAmount = _this.pageAmount || this.amountArr[0];
        this.count =  Math.ceil(_this.dataTotal/_this.pageAmount);     //总共多少页
        // 获取元素参数
        var mypage = document.getElementById(_this.ele);
        this.ul.innerHTML = '';
        mypage.appendChild(this.ul);
        // 显示总页数
        var str = '';
        this.ele.innerHTML = '';
        str += '<span>共 '+_this.count+' 页</span>';
        //首页
        _this.firstPage();
        //上一页
        _this.prevPage();
        // 当前页
        if(this.curpage>this.count){
            //如果当前页大于总页数，返回到第一页
            this.curpage=1;
        }
        _this.currentPage().forEach(function (item) {
            var li = document.createElement('li');
            if (item == _this.curpage) {
                li.className = 'active';
            } else {
                li.onclick = function () {
                    _this.curpage = parseInt(this.innerHTML);
                    _this.init();
                    _this.fun(_this.curpage);
                };
            }
            li.innerHTML = item;
            _this.ul.appendChild(li);
        });
        //下一页
        _this.nextPage();
        //尾页
        _this.lastPage();
        //跳转
        _this.goPage();
        _this.pageData(_this.pageAmount);

    },
    firstPage:function(){
        var _this = this;
        var li = document.createElement('li');
        li.innerHTML = '首页';
        this.ul.appendChild(li);
        li.onclick = function () {
            var val = parseInt(1);
            _this.curpage = val;
            _this.fun(_this.curpage);
            _this.init();
        };
    },
    prevPage:function(){
        var _this = this;
        var li = document.createElement('li');
        li.innerHTML = '上一页';
        if (parseInt(_this.curpage) > 1) {
            li.onclick = function () {
                _this.curpage = parseInt(_this.curpage) - 1;
                _this.init();
                _this.fun(_this.curpage);
            };
        } else {
            li.className = 'disabled';
        }
        this.ul.appendChild(li);
    },
    currentPage:function(){
        var pag = [];
        if (this.curpage <= this.count) {
            if (this.curpage < this.pageSize) {
                //当前页数小于显示条数
                var i = Math.min(this.pageSize, this.count);
                while (i) {
                    pag.unshift(i--);
                }
            } else {
                //当前页数大于显示条数
                var middle = this.curpage - Math.floor(this.pageSize / 2),
                    //从哪里开始
                    i = this.pageSize;
                if (middle > this.count - this.pageSize) {
                    middle = this.count - this.pageSize + 1;
                }
                while (i--) {
                    pag.push(middle++);
                }
            }
        } else {
            console.error('当前页数不能大于总页数');
        }
        if (!this.pageSize) {
            console.error('显示页数不能为空或者0');
        }
        return pag;
    },
    nextPage:function(){
        var _this = this;
        var li = document.createElement('li');
        li.innerHTML = '下一页';
        if (parseInt(_this.curpage) < parseInt(_this.count)) {
            li.onclick = function () {
                _this.curpage = parseInt(_this.curpage) + 1;
                _this.init();
                _this.fun(_this.curpage);
            };
        } else {
            li.className = 'disabled';
        }
        this.ul.appendChild(li);
    },
    lastPage:function(){
        var _this = this;
        var li = document.createElement('li');
        li.innerHTML = '尾页';
        this.ul.appendChild(li);
        li.onclick = function () {
            var yyfinalPage = _this.count;
            var val = parseInt(yyfinalPage);
            _this.curpage = val;
            _this.fun(_this.curpage);
            _this.init();
        };
    },
    pageData:function(curAmount,curPage){
        var _this = this;
        var li = document.createElement('li');
        li.innerHTML = '共&nbsp' + _this.count + '&nbsp页';
        li.className = 'totalPage';
        this.ul.appendChild(li);
        var li2 = document.createElement('li');
        var str = '';
        _this.amountArr.forEach(function(currentValue,index,arr){
            if(currentValue == curAmount){
                str += '<option selected value="'+currentValue+'">'+currentValue+'</option>';
            }else{
                str += '<option value="'+currentValue+'">'+currentValue+'</option>';
            }
        });
        li2.innerHTML = '每页&nbsp<select>'+str+'</select>&nbsp条';
        li2.className = 'totalPage';
        this.ul.appendChild(li2);
        document.querySelector('.totalPage>select').onchange=function(event) {
            _this.pageAmount = this.value;
            this.value = curAmount;
            _this.init(Number(this.value));
            _this.fun(_this.curpage);
        };
        var li3 = document.createElement('li');
        li3.innerHTML = '共&nbsp' + _this.dataTotal + '&nbsp条数据';
        li3.className = 'totalPage';
        this.ul.appendChild(li3);
    },
    goPage:function(){
        var _this = this;
        var li = document.createElement('li');
        li.className = 'totalPage';
        var span1 = document.createElement('span');
        span1.innerHTML = '跳转到';
        li.appendChild(span1);
        var input = document.createElement('input');
        input.setAttribute("type","number");
        input.onkeydown = function (e) {
            var oEvent = e || event;
            if (oEvent.keyCode == '13') {
                var val = parseInt(oEvent.target.value);
                if (typeof val === 'number' && val <= _this.count) {
                    _this.curpage = val;
                    _this.fun(_this.curpage);
                }else{
                    alert("跳转页数不能大于总页数 !")
                }
                _this.init();
            }
        };
        li.appendChild(input);
        var span2 = document.createElement('span');
        span2.innerHTML = '页';
        li.appendChild(span2);
        this.ul.appendChild(li);
    },
}
