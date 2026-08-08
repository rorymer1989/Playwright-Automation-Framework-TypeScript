const {

allure

} = require("allure-playwright");

interface StepCallback {
	(): Promise<void> | void;
}

interface StepUtilInterface {
	step(title: string, callback: StepCallback): Promise<void>;
}

class StepUtil implements StepUtilInterface{

async step(title: string,callback: StepCallback): Promise<void>{

await allure.step(title,async()=>{

await callback();

});

}

}

module.exports=new StepUtil();