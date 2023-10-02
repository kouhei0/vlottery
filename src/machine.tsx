import React, { useCallback, useState } from "react";
import { Box, Modal, ModalClose, Sheet, Typography } from "@mui/joy";

type Item = {
  name: string;
  color: string;
  quantity: number;
};
const Machine = (props: { items: Item[], onFinish: (item: Item) => void }) => {
  const { items, onFinish } = props;

  const [ pickItem, setPickItem ] = useState<Item | null>(null);
  const [ showResult, setShowResult ] = useState(false);

  const onClick = useCallback(() => {
    const rand = Math.random();
    const totalQuantity = items.reduce((a, n) => n.quantity + a, 0);
    const rates = items.map(n => n.quantity / totalQuantity);
    let accumulate = 0;
    let idx;
    for (idx = 0; idx < rates.length; idx++) {
      accumulate += rates[idx];
      if (rand < accumulate)
        break;
    }
    const item = items[idx];
    setPickItem(item);
  }, [ items ]);
  const onAnimationEnd = useCallback(() => {
    setTimeout(() => {
      setShowResult(true);
    }, 300);
  }, []);
  return <Box sx={{
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#444",
    overflow: "hidden"
  }} >
    <Modal open={!!showResult}
      onClose={() => {
        pickItem && onFinish(pickItem);
        setPickItem(null);
        setShowResult(false);
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: "md",
          width: "80%"
        }}
      >
        <ModalClose variant="plain" />
        <Typography level="h2">
          🎉 おめでとうございます！
        </Typography>
        <Typography sx={{ p: 2 }} textAlign="center" level="h1" component="p">
          {pickItem?.name}
        </Typography>
        <Typography textAlign="right">
          が出ました
        </Typography>
      </Sheet>
    </Modal>
    <svg style={{ position: "absolute", left: "10%", right: "10%" }} viewBox="100 100 200 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="inner-shadow-filter-0" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="0"/>
          <feGaussianBlur stdDeviation="3"/>
          <feComposite operator="out" in="SourceGraphic"/>
          <feComponentTransfer result="choke">
            <feFuncA type="linear" slope="1"/>
          </feComponentTransfer>
          <feFlood floodColor="rgba(0,0,0,0.7)" result="color"/>
          <feComposite operator="in" in="color" in2="choke" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
        <filter id="inner-shadow-filter-3" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="0"/>
          <feGaussianBlur stdDeviation="5"/>
          <feComposite operator="out" in="SourceGraphic"/>
          <feComponentTransfer result="choke">
            <feFuncA type="linear" slope="1"/>
          </feComponentTransfer>
          <feFlood floodColor="rgba(0,0,0,0.7)" result="color"/>
          <feComposite operator="in" in="color" in2="choke" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
        <filter id="inner-shadow-filter-1" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="0"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite operator="out" in="SourceGraphic"/>
          <feComponentTransfer result="choke">
            <feFuncA type="linear" slope="1"/>
          </feComponentTransfer>
          <feFlood floodColor="rgba(0,0,0,0.7)" result="color"/>
          <feComposite operator="in" in="color" in2="choke" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>

        <filter id="inner-shadow-filter-4" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="0"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite operator="out" in="SourceGraphic"/>
          <feComponentTransfer result="choke">
            <feFuncA type="linear" slope="1"/>
          </feComponentTransfer>
          <feFlood floodColor="rgba(0,0,0,0.7)" result="color"/>
          <feComposite operator="in" in="color" in2="choke" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>

      </defs>
      <g style={{ transform: "translateY(-130px)", animation: pickItem ? "View-shift 1 .8s .7s ease-in forwards" : "" }}>

        <g onAnimationEnd={onAnimationEnd} style={{ transformOrigin: "200px 200px", animation: pickItem ? "Drop-cap 1 1s 0.5s ease-in forwards" : "" }}>
          <ellipse style={{filter: "url('#inner-shadow-filter-4')", fill: pickItem?.color ? pickItem.color : "rgb(255, 0, 0)"}} cx="200" cy="200" rx="40" ry="40"/>
          <ellipse style={{mixBlendMode: "screen", fill: "rgb(255, 255, 255)", fillOpacity: 0.8}} cx="185" cy="180" rx="6" ry="6"/>
          <ellipse style={{mixBlendMode: "screen", fill: "rgb(255, 255, 255)", fillOpacity: 0.8}} cx="175" cy="190" rx="2" ry="2"/>
        </g>

        <g style={{ filter: "url('#inner-shadow-filter-0')"}}>
          <path style={{fillRule: "nonzero", filter: "none", fill: "rgb(240, 64, 64)"}} d="M 100 256.669 L 300 256.669 L 300 496 C 300 498.209 298.209 500 296 500 L 104 500 C 101.791 500 100 498.209 100 496 Z M 153.706 383.563 L 153.706 466.667 C 153.706 468.876 155.497 470.667 157.706 470.667 L 240.81 470.667 C 243.019 470.667 244.81 468.876 244.81 466.667 L 244.81 383.563 C 244.81 381.354 243.019 379.563 240.81 379.563 L 157.706 379.563 C 155.497 379.563 153.706 381.354 153.706 383.563 Z"/>
          <path style={{fillRule: "nonzero", filter: "none", fill: "rgb(240, 64, 64)"}} d="M 104 100 H 296 A 4 4 0 0 1 300 104 V 113.883 H 100 V 104 A 4 4 0 0 1 104 100 Z"/>
          <rect style={{fillRule: "nonzero", fill: "rgb(241, 241, 241)"}} x="100" y="108.878" width="200" height="155.098" rx="4" ry="4"/>
        </g>
        <g style={{ cursor: "pointer", transformOrigin: "200px 320px", animation: pickItem ? "Dial-spin 1 1.5s linear" : "" }} onClick={onClick}>
          <ellipse  style={{filter: "url('#inner-shadow-filter-3')", fill: "rgb(255, 255, 255)", stroke: "rgb(0, 0, 0)"}} cx="200" cy="320" rx="45" ry="45"/>
          <ellipse style={{fill: "rgb(255, 255, 255)", stroke: "rgb(0, 0, 0)"}} cx="200" cy="320" rx="37" ry="37"/>
          <rect style={{fill: "rgb(255, 255, 255)", stroke: "rgb(0, 0, 0)"}} x="162.523" y="316" width="75" height="8" rx="4" ry="4"/>
          <path d="M 87.163 162.36 L 89.504 167.043 L 84.821 167.043 L 87.163 162.36 Z" style={{stroke: "rgb(0, 0, 0)", transformBox: "fill-box", fill: "rgb(255, 247, 0)"}} transform="matrix(0, -1, 1, 0, 80, 160)"/>
        </g>
        <g>
          <rect style={{fill: "rgb(255, 255, 255)", mixBlendMode: "screen"}} x="111.255" y="122.405" width="9.395" height="9.917" rx="4" ry="4"/>
          <rect style={{fill: "rgb(255, 255, 255)", mixBlendMode: "screen"}} x="111.255" y="138.405" width="9.395" height="68.894" rx="4" ry="4"/>
        </g>

        <path style={{fillRule: "nonzero", fill: "rgb(255, 255, 255)", filter: "url('#inner-shadow-filter-1')"}} d="M 153.706 457.084 H 244.81 V 466.667 A 4 4 0 0 1 240.81 470.667 H 157.706 A 4 4 0 0 1 153.706 466.667 V 457.084 Z"/>
      </g>
    </svg>
    
  </Box>
};

export default React.memo(Machine);