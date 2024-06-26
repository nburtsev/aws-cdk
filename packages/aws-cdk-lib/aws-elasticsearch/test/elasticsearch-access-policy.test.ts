import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, Stack } from '../../core';
import { ElasticsearchAccessPolicy } from '../lib/elasticsearch-access-policy';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  new ElasticsearchAccessPolicy(stack, 'ElasticsearchAccessPolicy', {
    domainName: 'TestDomain',
    domainArn: 'test:arn',
    accessPolicies: [new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['es:ESHttp*'],
      principals: [new iam.AnyPrincipal()],
      resources: ['test:arn'],

    })],
  });

  Template.fromStack(stack).hasResourceProperties('Custom::ElasticsearchAccessPolicy', {
    ServiceToken: {
      'Fn::GetAtt': [
        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
        'Arn',
      ],
    },
    Create: JSON.stringify({
      action: 'updateElasticsearchDomainConfig',
      service: 'ES',
      parameters: {
        DomainName: 'TestDomain',
        AccessPolicies: '{"Statement":[{"Action":"es:ESHttp*","Effect":"Allow","Principal":{"AWS":"*"},"Resource":"test:arn"}],"Version":"2012-10-17"}',
      },
      outputPaths: ['DomainConfig.ElasticsearchClusterConfig.AccessPolicies'],
      physicalResourceId: { id: 'TestDomainAccessPolicy' },
      logApiResponseData: true,
    }),
    Update: JSON.stringify({
      action: 'updateElasticsearchDomainConfig',
      service: 'ES',
      parameters: {
        DomainName: 'TestDomain',
        AccessPolicies: '{"Statement":[{"Action":"es:ESHttp*","Effect":"Allow","Principal":{"AWS":"*"},"Resource":"test:arn"}],"Version":"2012-10-17"}',
      },
      outputPaths: ['DomainConfig.ElasticsearchClusterConfig.AccessPolicies'],
      physicalResourceId: { id: 'TestDomainAccessPolicy' },
      logApiResponseData: true,
    }),
  });
});

test('support access policy added inline and later', () => {
  const elasticsearchAccessPolicy = new ElasticsearchAccessPolicy(stack, 'ElasticsearchAccessPolicy', {
    domainName: 'TestDomain',
    domainArn: 'test:arn',
    accessPolicies: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['es:ESHttp*'],
        principals: [new iam.AnyPrincipal()],
        resources: ['test:arn'],
      }),
    ],
  });
  elasticsearchAccessPolicy.addAccessPolicies(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['*'],
      principals: [new iam.AnyPrincipal()],
      resources: ['test:arn'],
    }),
  );

  Template.fromStack(stack).hasResourceProperties('Custom::ElasticsearchAccessPolicy', {
    ServiceToken: {
      'Fn::GetAtt': [
        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
        'Arn',
      ],
    },
    Create: JSON.stringify({
      action: 'updateElasticsearchDomainConfig',
      service: 'ES',
      parameters: {
        DomainName: 'TestDomain',
        AccessPolicies: '{"Statement":[{"Action":"es:ESHttp*","Effect":"Allow","Principal":{"AWS":"*"},"Resource":"test:arn"},{"Action":"*","Effect":"Allow","Principal":{"AWS":"*"},"Resource":"test:arn"}],"Version":"2012-10-17"}',
      },
      outputPaths: ['DomainConfig.ElasticsearchClusterConfig.AccessPolicies'],
      physicalResourceId: { id: 'TestDomainAccessPolicy' },
      logApiResponseData: true,
    }),
    Update: JSON.stringify({
      action: 'updateElasticsearchDomainConfig',
      service: 'ES',
      parameters: {
        DomainName: 'TestDomain',
        AccessPolicies: '{"Statement":[{"Action":"es:ESHttp*","Effect":"Allow","Principal":{"AWS":"*"},"Resource":"test:arn"},{"Action":"*","Effect":"Allow","Principal":{"AWS":"*"},"Resource":"test:arn"}],"Version":"2012-10-17"}',
      },
      outputPaths: ['DomainConfig.ElasticsearchClusterConfig.AccessPolicies'],
      physicalResourceId: { id: 'TestDomainAccessPolicy' },
      logApiResponseData: true,
    }),
  });
});
