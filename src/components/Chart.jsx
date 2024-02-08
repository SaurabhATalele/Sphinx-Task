import React from "react";
import "./Chart.css";
import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
const Chart = () => {
  const [stage1, setStage1] = useState({ temp: 95, time: "3:00" });
  const [stage2, setStage2] = useState([
    { temp: 95, time: "0:30" },
    { temp: 60, time: "3:00" },
  ]);
  const [stage3, setStage3] = useState([
    { temp: 90, time: "3:00" },
    { temp: 60, time: "3:00" },
    { temp: 95, time: "3:00" },
  ]);
  const [activeStage, setActiveStage] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const [temp, setTemp] = useState(0);
  const [time, setTime] = useState(0);
  const [data, setData] = useState([stage1, ...stage2, ...stage3]);
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    const tempsArray = [
      stage1.temp,
      ...stage2.map((item) => item.temp),
      ...stage3.map((item) => item.temp),
    ];

    console.log("Data changed", data, data.length * 100 - 50);
    const w = 100 * data.length - 75;
    const h = 500;
    const svg = d3.select(svgRef.current).attr("width", w).attr("height", h);

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, w]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    const generateScaledLine = d3
      .line()
      .x((d, i) => xScale(i))
      .y(yScale)
      .curve(d3.curveCardinal);

    svg
      .selectAll(".line")
      .data([tempsArray])
      .join("path")
      .attr("d", (d) => generateScaledLine(d))
      .attr("fill", "none")
      .attr("stroke", "rgb(255, 230, 118)");

    console.log("here we are");
  }, [data]);

  //   insert before the active point
  const addBefore = () => {
    if (activeStage === 2 && stage2.length === 4) {
      alert("Stage 2 is full");
      setData([stage1, ...stage2, ...stage3]);
      return;
    }
    var updatedStage2;
    if (activeStage === 2) {
      updatedStage2 = [...stage2];
      updatedStage2.splice(activePoint, 0, { temp, time });
      setStage2(updatedStage2);
    } else if (activeStage === 3) {
      updatedStage2 = [...stage3];
      updatedStage2.splice(activePoint, 0, { temp, time });
      setStage3(updatedStage2);
    }
    setData([stage1, ...updatedStage2, ...stage3]);
  };

  //   insert afetr the active point
  const addAfter = () => {
    if (activeStage === 2 && stage2.length === 4) {
      alert("Stage 2 is full");
      setData([stage1, ...stage2, ...stage3]);

      return;
    }
    console.log(activeStage, stage2, stage3);
    var updatedStage2;
    if (activeStage === 2) {
      updatedStage2 = [...stage2];
      updatedStage2.splice(activePoint + 1, 0, { temp, time });
      setStage2(updatedStage2);
    } else if (activeStage === 3) {
      updatedStage2 = [...stage3];
      updatedStage2.splice(activePoint + 1, 0, { temp, time });
      setStage3(updatedStage2);
    }
    setData([stage1, ...updatedStage2, ...stage3]);
  };

  const updateStage1 = () => {
    setStage1({ temp, time });
    setData([{ temp, time }, ...stage2, ...stage3]);
  };

  return (
    <>
      <svg ref={svgRef} className="svg" />
      <div className="container">
        <div className="chart-container">
          <div className="stage1">
            <h4 className="stage-heading">Stage1</h4>
            <div className="columns">
              <div className="stage-column">
                <div
                  className={`${
                    activeStage === 1 && activePoint === 1
                      ? "point-active"
                      : "point"
                  }`}
                  onClick={() => {
                    console.log(activeStage);
                    setActivePoint(activePoint === 1 ? null : 1);
                    setActiveStage(activeStage === 1 ? null : 1);
                    console.log(activeStage);
                  }}
                  style={{ top: `${100 - stage1.temp}%` }}
                >
                  <div
                    style={{
                      position: "absolute",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <h4>{stage1.temp}&#176;</h4>
                    <h4>{stage1.time}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stage2">
            <h4 className="stage-heading">Stage2</h4>
            <div className="columns">
              {stage2 &&
                stage2.map((point, index) => {
                  return (
                    <div className="stage-column" key={index}>
                      <div
                        className={`${
                          activePoint === index && activeStage === 2
                            ? "point-active"
                            : "point"
                        }`}
                        onClick={() => {
                          setActivePoint(activePoint === index ? null : index);
                          setActiveStage(activeStage === 2 ? null : 2);
                        }}
                        style={{ top: `${100 - point.temp}%` }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <h4>{point.temp}&#176;</h4>
                          <h4>{point.time}</h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="stage3">
            <h4 className="stage-heading">Stage3</h4>
            <div className="columns">
              {stage3.map((point) => {
                return (
                  <div className="stage-column">
                    <div
                      className={`${
                        activeStage === 3 &&
                        activePoint === stage3.indexOf(point)
                          ? "point-active"
                          : "point"
                      }`}
                      onClick={() => {
                        console.log(stage3.indexOf(point));
                        setActivePoint(
                          activePoint === stage3.indexOf(point)
                            ? null
                            : stage3.indexOf(point)
                        );
                        setActiveStage(activeStage === 3 ? null : 3);
                      }}
                      style={{ top: `${100 - point.temp}%` }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <h4>{point.temp}&#176;</h4>
                        <h4>{point.time}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="data-container">
          <div className="data-tile">
            {data.map((point) => {
              return (
                <div className="tile-inner">
                  <p>{point.temp}&#176;</p>
                  <p>{point.time}</p>
                </div>
              );
            })}
          </div>
          {activeStage && (
            <div className="action-tile">
              <div className="values">
                <input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                />
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              {activeStage === 1 ? (
                <div className="buttons">
                  <button onClick={updateStage1}>Update</button>
                </div>
              ) : (
                <div className="buttons">
                  <button onClick={addBefore}>Before</button>
                  <button onClick={addAfter}>After</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chart;
