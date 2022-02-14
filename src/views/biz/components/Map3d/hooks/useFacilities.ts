import useFacilitity_Building from "./useFacilitity_Building";
import useFacilitity_Chuanwu from "./useFacilitity_Chuanwu";
import useFacilitity_Jiankong from "./useFacilitity_Jiankong";
import useFacilitity_Langzhuang from "./useFacilitity_Langzhuang";
import useFacilitity_Longmendiao from "./useFacilitity_Longmendiao";
import useFacilitity_Mao from "./useFacilitity_Mao";
import useFacilitity_Matou from "./useFacilitity_Matou";
import useFacilitity_Menji from "./useFacilitity_Menji";

export default (viewer: any, zccityTool: any) => {
    useFacilitity_Mao(viewer);
    useFacilitity_Matou(viewer);
    useFacilitity_Chuanwu(viewer);
    useFacilitity_Building(viewer);
    useFacilitity_Jiankong(viewer);
    useFacilitity_Langzhuang(viewer, zccityTool);
    useFacilitity_Menji(viewer, zccityTool);
    useFacilitity_Longmendiao(viewer, zccityTool);
}