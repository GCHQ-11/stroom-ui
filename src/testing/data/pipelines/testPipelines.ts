import inherited from "./pipeline.inherited.testData";
import simple from "./pipeline.simple.testData";
import singleElement from "./pipeline.singleElement.testData";
import longPipeline from "./pipeline.longPipeline.testData";
import forkedPipeline from "./pipeline.forkedPipeline.testData";
import forkRemoved from "./pipeline.forkRemoved.testData";
import childRestoredLink from "./pipeline.childRestoredLink.testData";
import multiBranchChild from "./pipeline.multiBranchChild.testData";
import multiBranchParent from "./pipeline.multiBranchParent.testData";
import {
  noParent,
  childNoProperty,
  childWithProperty,
  childNoPropertyParentNoProperty,
  childNoPropertyParentWithProperty,
  childWithPropertyParentNoProperty,
  childWithPropertyParentWithProperty,
  childWithRemoveForItsParentsAdd,
  emptyChildParentWithProperty
} from "./pipeline.propertyInheritance.testData";

export default {
  inherited,
  simple,
  forkedPipeline,
  forkRemoved,
  childRestoredLink,
  multiBranchChild,
  multiBranchParent,
  singleElement,
  longPipeline,
  noParent,
  childNoProperty,
  childWithProperty,
  childNoPropertyParentNoProperty,
  childNoPropertyParentWithProperty,
  childWithPropertyParentNoProperty,
  childWithPropertyParentWithProperty,
  childWithRemoveForItsParentsAdd,
  emptyChildParentWithProperty
};
