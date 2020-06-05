import { v4 } from "../deps.ts";
import Survey from "./Survey.ts";
import { surveyCollection, questionCollection } from "../mongo.ts";

export default class Question {
  public id: string;
  public text: string;
  public type: string;
  public required: boolean;
  public data: object;

  constructor({ id = '', text = '', type = '', required = false, data = {} } = {}) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.required = required;
    this.data = data;
  }

  static async getBySurvey(surveyId: string) {
    const questions = await questionCollection.find({ surveyId })
    if (!questions) {
      return [];
    }
    return questions;
  }

  async create() {
    const { $oid } = await questionCollection.insertOne(this)
    this.id = $oid;
    return this;
  }

  static async get(id: string) {
    const question = await questionCollection.find({ _id: { $oid: id } });
    if (!question) {
      return null;
    }
    return new Question(question);
  }

  public async update({ text = '', type = '', required = false, data = {}  }) {
    this.text = text;
    this.type = type;
    this.required = required;
    this.data = data;
    const { modifiedCount } = await questionCollection.updateOne({ _id: { $oid: this.id } }, {
      $set: this
    });
    return this;
  }
}