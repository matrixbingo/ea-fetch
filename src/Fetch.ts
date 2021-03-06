//import {FetchInter} from './Fetch.inter';
import Request,{AjaxPropsInter} from './Request';
import {Promise} from 'es6-promise';

export interface FetchInter{
    mock?:any;
    run(url:string,options?:any,isLoadingBar?:true):any;
}

export default class Fetch implements FetchInter{

    loadingBar:any;
    mock:any;

    /**
     * 构造函数
     * @param mock{object} mock实例化对象，需要实现
     * */
    constructor(mock:any,loadingBar:any){

        this.mock = mock;
        this.loadingBar = loadingBar;

        if(!this.mock ){
            this.mock = {
                getUrl:(url:string)=>{
                    console && console.warn('[Fetch mock getUrl]','未设置mock数据功能！');
                    return url;
                },
                getDev:()=>{
                    return false;
                }
            };
        }

        if(!this.loadingBar){
            this.loadingBar = {
                run:(props:any)=>{
                    console && console.warn('[Fetch loadingBar run]','未设置loadingbar功能！');
                },
                end:()=>{
                    //console && console.warn('[Fetch loadingBar  end]','未设置loadingbar');
                }
            };
        }
    }

    addLoadingBar(loadingBar:any){
        this.loadingBar = loadingBar;
        return this;
    }

    addMock(mock:any){
        this.mock = mock;
        return this;
    }

    fetch(url:string,params:{},success:Function,error:Function,opts:AjaxPropsInter,isLoadingBar:true){

        if(isLoadingBar == undefined){
            isLoadingBar = true
        }
        //todo 需要处理是否加载loadingbar的逻辑

        isLoadingBar && this.loadingBar.run(opts || {});
        //todo 处理是否是走的mock链接

        opts.success = (data:{},xhr:any)=>{
            isLoadingBar && this.loadingBar.end();
            success && success.call(xhr,data,xhr);
        };
        opts.error =(xhr:any)=>{
            isLoadingBar && this.loadingBar.end();
            error && error.call(xhr,xhr);
        };
        opts.data = params;

        url = this.mock.getUrl(url);
        if(this.mock.getDev&&this.mock.getDev() ){
           opts.method = 'GET';
        }
        return new Request().fetch(url,opts );
    }

    /**
     * 执行异步操作
     * @param url{string} ajax请求路径
     * @param options{object} 包含dataType、asyn、method、timeout、credentials=include、header={}
     * @return promise
     * */
    run(url:string,options:AjaxPropsInter = {
        body:{},
        error:function(){},
        success:function(){},
        method:'GET'
    },isLoadingBar:true):any{

        const _this = this;
        return new Promise(function(resolve:any, reject:any) {

            _this.fetch(url,options.body,(data,xhr)=>{
                resolve(data,xhr);
            },(xhr)=>{
                reject(xhr);
            },options, isLoadingBar);
        });
    }
}