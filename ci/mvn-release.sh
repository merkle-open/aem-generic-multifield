#!/usr/bin/env bash

function getVersion() {
  xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml
}

CURRENT_VERSION=$(getVersion)
if [[ $CURRENT_VERSION == *-SNAPSHOT ]]; then
	echo "perform release"
	mvn versions:set -DremoveSnapshot versions:commit --no-transfer-progress
  NEW_VERSION=$(getVersion)

 	echo "commit new release version"
	git commit -a -m "Release $NEW_VERSION: set master to new release version"

	echo "Update version in README.md"
	sed -i -e "s|<version>[0-9A-Za-z._-]\{1,\}</version>|<version>$NEW_VERSION</version>|g" README.md && rm -f README.md-e
	git commit -a -m "Release $NEW_VERSION: Update README.md"

	echo "create tag for new release"
	git tag -a $NEW_VERSION -m "Release $NEW_VERSION: tag release"

	echo "update develop version"
	git fetch --all
	git checkout develop
	mvn versions:set -DnextSnapshot versions:commit --no-transfer-progress
  NEXT_SNAPSHOT=$(getVersion)
	echo "commit new snapshot version"
	git commit -a -m "Release $NEW_VERSION: set develop to next development version $NEXT_SNAPSHOT"

	git push --all
	git push --tags
fi
