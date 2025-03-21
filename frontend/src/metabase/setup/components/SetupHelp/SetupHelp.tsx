import { t } from "ttag";

import { useDocsUrl } from "metabase/common/hooks";
import ExternalLink from "metabase/core/components/ExternalLink";
import CS from "metabase/css/core/index.css";

import { SetupFooterRoot } from "./SetupHelp.styled";

export const SetupHelp = (): JSX.Element => {
  const { url: docsUrl } = useDocsUrl(
    "configuring-metabase/setting-up-metabase",
  );
  return (
    <SetupFooterRoot>
      {t`If you feel stuck`},{" "}
      <ExternalLink
        className={CS.link}
        href={"https://galaxy.one/lien-he/"}
        target="_blank"
      >{t`please contact us`}</ExternalLink>{" "}
      {t`is just a click away.`}
    </SetupFooterRoot>
  );
};
