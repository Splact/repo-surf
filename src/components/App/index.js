import React from "react";

import useRepo from "hooks/useRepo";

import "./style.scss";

const App = () => {
  const { owner, repo, commits, isLoading, error } = useRepo();

  console.log(owner, repo, commits, isLoading, error);

  return (
    <div className="App">
      <h1>Repo Surf</h1>
      <p>
        Styled-components throttle flask cloud. Angular styled-components,
        lodash styled-components git webvr eslint source stackoverflow python,
        jquery, django preact shuffle webvr firefox redux jquery ie autoprefixer
        json, dojo, firebase postcss, uglify boto. Flask cryptography droplet
        promise firebase isomorphic webvr, classnames backbone python history
        ec2, ie firefox. Pillow vue, s3. Php polymer. Ajax.
      </p>
    </div>
  );
};

export default App;
