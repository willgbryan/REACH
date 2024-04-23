import React, { memo, useState, useEffect } from "react";

import useTimeout from "../../hooks/useTimeout";

import CONSTANTS from "../../utils/constants";

const OptimizedStatusBar = memo(function StatusBar({
  newMsg
}) {
  const [msg, setMsg] = useState("");

  useTimeout(() => {
    setMsg(newMsg, CONSTANTS.STATUS_TIMEOUT);
  });

  return msg ? <div className="status">{msg}</div> : null;
});

export default OptimizedStatusBar;
