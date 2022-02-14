import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption,
    GridComponent,
    GridComponentOption,
    // TitleComponent,
    // TitleComponentOption
    GraphicComponent,
    GraphicComponentOption
} from 'echarts/components';
import { PieChart, PieSeriesOption, LineChart, LineSeriesOption, BarChart, BarSeriesOption } from 'echarts/charts';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

export type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | LegendComponentOption | PieSeriesOption | LineSeriesOption | GridComponentOption | BarSeriesOption | GraphicComponentOption
>;

echarts.use([
    TooltipComponent,
    LegendComponent,
    GridComponent,
    GraphicComponent,
    PieChart,
    LineChart,
    BarChart,
    // CanvasRenderer,
    SVGRenderer,
    LabelLayout,
    UniversalTransition,
]);

export default echarts;