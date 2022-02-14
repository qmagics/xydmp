export default (viewer: any) => {
    const stages = viewer.scene.postProcessStages;
    viewer.scene.brightness = viewer.scene.brightness || stages.add(zccity.PostProcessStageLibrary
        .createBrightnessStage());
    viewer.scene.brightness.enabled = true;
    viewer.scene.brightness.uniforms.brightness = Number(1);


    // setTimeout(() => {
    //     viewer.scene.brightness.uniforms.brightness = Number(0.5);
    // }, 10000);
}