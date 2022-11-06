require 'sinatra'
require "redis"
require 'httparty'

REDIS_DB = 11

get '/domains' do
    r = Redis.new(db: REDIS_DB)
    blocked_domains = r.keys.map {|k| [k, JSON.parse(r.get(k))]}.to_h
    
    if request.accept? 'application/json' then
        return blocked_domains.to_json
    end    
    return Zlib::Deflate.deflate(blocked_domains.to_json)
end

patch '/domains' do
    domain = params['domain']
    if domain.nil? then
        return [400, "expected domain query parameter"]
    end

    authorization = request.env["HTTP_AUTHORIZATION"]
    if authorization.nil? then
        return [400, "expected Authorization header"]
    end

    blocked_domains = JSON.parse(Zlib::Inflate.inflate(request.body.read))
    # Verify provided token against instance 
    validation = HTTParty.get("https://#{domain}/api/v1/apps/verify_credentials", headers: {
        Authorization: authorization
    });

    case validation.response.code.to_i
    when 200
        r = Redis.new(db: REDIS_DB)
        blocked_domains.each do |domain, details|
            r.setnx(domain, details.to_json)
        end
        200 
    when 399..499
        logger.warn "Failed to verify for #{domain}"
        return [validation.response.code, validation.response.body]
    else
        return validation.response.code
    end
end